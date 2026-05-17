variable "kubeconfig_path" {
  type        = string
  default     = "~/.kube/config"
  description = "Path to the local kubeconfig file"
}

variable "environment" {
  type        = string
  default     = "development"
  description = "Target deployment environment (e.g. development, production)"
}

variable "app_namespace" {
  type        = string
  default     = "collabspace"
  description = "Target namespace for application deployment workloads"
}

variable "monitoring_namespace" {
  type        = string
  default     = "monitoring"
  description = "Target namespace for prometheus and grafana observability"
}

variable "server_replicas" {
  type        = number
  default     = 2
  description = "Baseline replica count for backend API server pod nodes"
}
