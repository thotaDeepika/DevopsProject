output "app_namespace" {
  value       = kubernetes_namespace.collabspace.metadata[0].name
  description = "Application deployment namespace"
}

output "monitoring_namespace" {
  value       = kubernetes_namespace.monitoring.metadata[0].name
  description = "Monitoring and observability namespace"
}

output "server_service_endpoint" {
  value       = kubernetes_service.server.metadata[0].name
  description = "Local DNS cluster service name for backend API node"
}

output "hpa_status" {
  value       = kubernetes_horizontal_pod_autoscaler_v2.server_hpa.metadata[0].name
  description = "Active GreenOps scaling policies"
}
