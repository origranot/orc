# Orphan Resource Collector (ORC)
**Orphan Resource Collector (ORC)** is an open-source tool designed to detect and manage orphaned resources in Kubernetes clusters. It consists of two main components:

- **ORC Agent**: A lightweight Node.js service that runs inside the Kubernetes cluster, scanning for orphaned resources and pushing events to a centralized dashboard.
- **ORC Dashboard**: A Next.js-based web application where multiple clusters can be monitored.
