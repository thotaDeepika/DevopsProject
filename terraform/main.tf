terraform {
  required_version = ">= 1.5.0"
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23.0"
    }
  }
}

provider "kubernetes" {
  config_path = var.kubeconfig_path
}

# ----------------------------------------------------
# NAMESPACES DEFINITION
# ----------------------------------------------------
resource "kubernetes_namespace" "collabspace" {
  metadata {
    name = var.app_namespace
    labels = {
      name        = var.app_namespace
      environment = var.environment
      managed-by  = "terraform"
    }
  }
}

resource "kubernetes_namespace" "monitoring" {
  metadata {
    name = var.monitoring_namespace
    labels = {
      name        = var.monitoring_namespace
      environment = var.environment
      managed-by  = "terraform"
    }
  }
}

# ----------------------------------------------------
# CONFIGMAPS & APP SECRETS
# ----------------------------------------------------
resource "kubernetes_config_map" "collabspace_config" {
  metadata {
    name      = "collabspace-config"
    namespace = kubernetes_namespace.collabspace.metadata[0].name
  }

  data = {
    MONGO_URI = "mongodb://mongo.collabspace.svc.cluster.local:27017/collabspace"
    PORT      = "5000"
    NODE_ENV  = "production"
  }
}

# ----------------------------------------------------
# CORE DATABASE SPECIFICATION (MONGODB)
# ----------------------------------------------------
resource "kubernetes_persistent_volume_claim" "mongo_pvc" {
  metadata {
    name      = "mongo-pvc"
    namespace = kubernetes_namespace.collabspace.metadata[0].name
  }
  spec {
    access_modes = ["ReadWriteOnce"]
    resources {
      requests = {
        storage = "2Gi"
      }
    }
  }
}

resource "kubernetes_deployment" "mongo" {
  metadata {
    name      = "mongo"
    namespace = kubernetes_namespace.collabspace.metadata[0].name
    labels = {
      app = "mongo"
    }
  }

  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "mongo"
      }
    }

    template {
      metadata {
        labels = {
          app = "mongo"
        }
      }

      spec {
        container {
          name  = "mongo"
          image = "mongo:4.4" # Downgraded to support non-AVX CPU host architectures
          image_pull_policy = "IfNotPresent"
          
          port {
            container_port = 27017
          }

          volume_mount {
            name       = "mongo-storage"
            mount_path = "/data/db"
          }
        }

        volume {
          name = "mongo-storage"
          persistent_volume_claim {
            claim_name = kubernetes_persistent_volume_claim.mongo_pvc.metadata[0].name
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "mongo" {
  metadata {
    name      = "mongo"
    namespace = kubernetes_namespace.collabspace.metadata[0].name
  }
  spec {
    port {
      port        = 27017
      target_port = 27017
    }
    selector = {
      app = kubernetes_deployment.mongo.spec[0].template[0].metadata[0].labels.app
    }
    type = "ClusterIP"
  }
}

# ----------------------------------------------------
# BACKEND API NODES (SERVER)
# ----------------------------------------------------
resource "kubernetes_deployment" "server" {
  metadata {
    name      = "server"
    namespace = kubernetes_namespace.collabspace.metadata[0].name
    labels = {
      app = "server"
    }
  }

  spec {
    replicas = var.server_replicas
    selector {
      match_labels = {
        app = "server"
      }
    }

    template {
      metadata {
        labels = {
          app = "server"
        }
      }

      spec {
        container {
          name  = "server"
          image = "collabspace-server:latest"
          image_pull_policy = "IfNotPresent"
          
          port {
            container_port = 5000
          }

          env_from {
            config_map_ref {
              name = kubernetes_config_map.collabspace_config.metadata[0].name
            }
          }

          # GreenOps energy optimized resource allocation
          resources {
            requests = {
              cpu    = "100m"
              memory = "128Mi"
            }
            limits = {
              cpu    = "300m"
              memory = "256Mi"
            }
          }

          readiness_probe {
            http_get {
              path = "/health"
              port = 5000
            }
            initial_delay_seconds = 15
            period_seconds        = 10
          }

          liveness_probe {
            http_get {
              path = "/health"
              port = 5000
            }
            initial_delay_seconds = 20
            period_seconds        = 15
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "server" {
  metadata {
    name      = "server"
    namespace = kubernetes_namespace.collabspace.metadata[0].name
  }
  spec {
    port {
      port        = 5000
      target_port = 5000
    }
    selector = {
      app = kubernetes_deployment.server.spec[0].template[0].metadata[0].labels.app
    }
    type = "ClusterIP"
  }
}

# ----------------------------------------------------
# HORIZONTAL POD AUTOSCALER (GREENOPS OPTIMIZATION)
# ----------------------------------------------------
resource "kubernetes_horizontal_pod_autoscaler_v2" "server_hpa" {
  metadata {
    name      = "server-hpa"
    namespace = kubernetes_namespace.collabspace.metadata[0].name
  }

  spec {
    scale_target_ref {
      api_version = "apps/v1"
      kind        = "Deployment"
      name        = kubernetes_deployment.server.metadata[0].name
    }

    min_replicas = 2
    max_replicas = 6

    metric {
      type = "Resource"
      resource {
        name = "cpu"
        target {
          type               = "Utilization"
          average_utilization = 80
        }
      }
    }

    metric {
      type = "Resource"
      resource {
        name = "memory"
        target {
          type               = "Utilization"
          average_utilization = 85
        }
      }
    }

    behavior {
      scale_up {
        stabilization_window_seconds = 0
        policy {
          type           = "Percent"
          value          = 100
          period_seconds = 15
        }
      }
      scale_down {
        stabilization_window_seconds = 120 # Energy saving rapid scale down window
        policy {
          type           = "Percent"
          value          = 100
          period_seconds = 15
        }
      }
    }
  }
}
