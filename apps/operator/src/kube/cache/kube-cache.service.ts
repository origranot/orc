import { Injectable, Logger } from '@nestjs/common';
import * as k8s from '@kubernetes/client-node';
import { KubeService } from '../kube.service';

interface CachedData<T> {
  timestamp: number;
  data: T[];
}

type ResourceType =
  | 'pods'
  | 'nodes'
  | 'services'
  | 'namespaces'
  | 'endpoints'
  | 'ingresses'
  | 'deployments'
  | 'secrets'
  | 'statefulsets'
  | 'pdbs'
  | 'persistentvolumes'
  | 'storageclasses'
  | 'roles'
  | 'rolebindings';

@Injectable()
export class KubeCache {
  private readonly logger = new Logger(KubeCache.name);
  private readonly TTL = 30_000; // 30 seconds
  private readonly cache = new Map<string, CachedData<any>>();

  constructor(private readonly kubeService: KubeService) {}

  private async getAndCache<T>(resourceType: ResourceType, fetcher: () => Promise<{ items: T[] }>, params?: any): Promise<T[]> {
    const cacheKey = this.buildCacheKey(resourceType, params);

    const cached = this.cache.get(cacheKey);
    const now = Date.now();

    if (cached && now - cached.timestamp < this.TTL) {
      this.logger.debug(`Cache hit for ${cacheKey}, age: ${now - cached.timestamp}ms`);
      return cached.data;
    }

    try {
      const { items } = await fetcher();
      this.cache.set(cacheKey, { timestamp: now, data: items });
      return items;
    } catch (error) {
      this.logger.error(`Failed to fetch ${resourceType}: ${error.message}`);
      if (cached) {
        this.logger.warn(`Using stale cache for ${resourceType}`);
        return cached.data;
      }
      throw error;
    }
  }

  private buildCacheKey(resourceType: string, params?: any): string {
    if (!params) return resourceType;
    const paramStr = JSON.stringify(params);
    return `${resourceType}/${paramStr}`;
  }

  async getNamespacedPods(params: k8s.CoreV1ApiListNamespacedPodRequest): Promise<k8s.V1Pod[]> {
    return this.getAndCache<k8s.V1Pod>('pods', () => this.kubeService.coreApi.listNamespacedPod(params), params);
  }

  async getAllPods(params?: k8s.CoreV1ApiListPodForAllNamespacesRequest): Promise<k8s.V1Pod[]> {
    return this.getAndCache<k8s.V1Pod>('pods', () => this.kubeService.coreApi.listPodForAllNamespaces(params), params);
  }

  async getNamespacedServices(params: k8s.CoreV1ApiListNamespacedServiceRequest): Promise<k8s.V1Service[]> {
    return this.getAndCache<k8s.V1Service>('services', () => this.kubeService.coreApi.listNamespacedService(params), params);
  }

  async getAllServices(params?: k8s.CoreV1ApiListServiceForAllNamespacesRequest): Promise<k8s.V1Service[]> {
    return this.getAndCache<k8s.V1Service>('services', () => this.kubeService.coreApi.listServiceForAllNamespaces(params), params);
  }

  async getNamespacedEndpoints(params: k8s.CoreV1ApiReadNamespacedEndpointsRequest): Promise<k8s.V1Endpoints[]> {
    return this.getAndCache<k8s.V1Endpoints>('endpoints', () => this.kubeService.coreApi.listNamespacedEndpoints(params), params);
  }

  async getAllEndpoints(params?: k8s.CoreV1ApiListEndpointsForAllNamespacesRequest): Promise<k8s.V1Endpoints[]> {
    return this.getAndCache<k8s.V1Endpoints>('endpoints', () => this.kubeService.coreApi.listEndpointsForAllNamespaces(params), params);
  }

  async getNamespacedDeployments(params: k8s.AppsV1ApiListNamespacedDeploymentRequest): Promise<k8s.V1Deployment[]> {
    return this.getAndCache<k8s.V1Deployment>('deployments', () => this.kubeService.appsApi.listNamespacedDeployment(params), params);
  }

  async getAllDeployments(params?: k8s.AppsV1ApiListDeploymentForAllNamespacesRequest): Promise<k8s.V1Deployment[]> {
    return this.getAndCache<k8s.V1Deployment>('deployments', () => this.kubeService.appsApi.listDeploymentForAllNamespaces(params), params);
  }

  async getNamespacedSecrets(params: k8s.CoreV1ApiListNamespacedSecretRequest): Promise<k8s.V1Secret[]> {
    return this.getAndCache<k8s.V1Secret>('secrets', () => this.kubeService.coreApi.listNamespacedSecret(params), params);
  }

  async getAllSecrets(params?: k8s.CoreV1ApiListSecretForAllNamespacesRequest): Promise<k8s.V1Secret[]> {
    return this.getAndCache<k8s.V1Secret>('secrets', () => this.kubeService.coreApi.listSecretForAllNamespaces(params), params);
  }

  async getAllRoleBindings(params?: k8s.RbacAuthorizationV1ApiListRoleBindingForAllNamespacesRequest): Promise<k8s.V1RoleBinding[]> {
    return this.getAndCache<k8s.V1RoleBinding>(
      'rolebindings',
      () => this.kubeService.rbacApi.listRoleBindingForAllNamespaces(params),
      params,
    );
  }

  async getNamespacedStatefulSets(params: k8s.AppsV1ApiListNamespacedStatefulSetRequest): Promise<k8s.V1StatefulSet[]> {
    return this.getAndCache<k8s.V1StatefulSet>('statefulsets', () => this.kubeService.appsApi.listNamespacedStatefulSet(params), params);
  }

  async getAllStatefulSets(params?: k8s.AppsV1ApiListStatefulSetForAllNamespacesRequest): Promise<k8s.V1StatefulSet[]> {
    return this.getAndCache<k8s.V1StatefulSet>(
      'statefulsets',
      () => this.kubeService.appsApi.listStatefulSetForAllNamespaces(params),
      params,
    );
  }

  async getAllRoles(params?: k8s.RbacAuthorizationV1ApiListRoleForAllNamespacesRequest): Promise<k8s.V1Role[]> {
    return this.getAndCache<k8s.V1Role>('roles', () => this.kubeService.rbacApi.listRoleForAllNamespaces(params), params);
  }

  async getNamespacedRoles(params: k8s.RbacAuthorizationV1ApiListNamespacedRoleRequest): Promise<k8s.V1Role[]> {
    return this.getAndCache<k8s.V1Role>('roles', () => this.kubeService.rbacApi.listNamespacedRole(params), params);
  }

  async getNamespacedIngresses(params: k8s.NetworkingV1ApiListNamespacedIngressRequest): Promise<k8s.V1Ingress[]> {
    return this.getAndCache<k8s.V1Ingress>('ingresses', () => this.kubeService.networkingApi.listNamespacedIngress(params), params);
  }

  async getAllIngresses(params?: k8s.NetworkingV1ApiListIngressForAllNamespacesRequest): Promise<k8s.V1Ingress[]> {
    return this.getAndCache<k8s.V1Ingress>('ingresses', () => this.kubeService.networkingApi.listIngressForAllNamespaces(params), params);
  }

  async getNamespacedPDBs(params: k8s.PolicyV1ApiListNamespacedPodDisruptionBudgetRequest): Promise<k8s.V1PodDisruptionBudget[]> {
    return this.getAndCache<k8s.V1PodDisruptionBudget>(
      'pdbs',
      () => this.kubeService.policyApi.listNamespacedPodDisruptionBudget(params),
      params,
    );
  }

  async getAllPDBs(params?: k8s.PolicyV1ApiListPodDisruptionBudgetForAllNamespacesRequest): Promise<k8s.V1PodDisruptionBudget[]> {
    return this.getAndCache<k8s.V1PodDisruptionBudget>(
      'pdbs',
      () => this.kubeService.policyApi.listPodDisruptionBudgetForAllNamespaces(params),
      params,
    );
  }

  async getNodes(params?: k8s.CoreV1ApiListNodeRequest): Promise<k8s.V1Node[]> {
    return this.getAndCache<k8s.V1Node>('nodes', () => this.kubeService.coreApi.listNode(params), params);
  }

  async getNamespaces(params?: k8s.CoreV1ApiListNamespaceRequest): Promise<k8s.V1Namespace[]> {
    return this.getAndCache<k8s.V1Namespace>('namespaces', () => this.kubeService.coreApi.listNamespace(params), params);
  }

  async getPersistentVolumes(params?: k8s.CoreV1ApiListPersistentVolumeRequest): Promise<k8s.V1PersistentVolume[]> {
    return this.getAndCache<k8s.V1PersistentVolume>(
      'persistentvolumes',
      () => this.kubeService.coreApi.listPersistentVolume(params),
      params,
    );
  }

  async getStorageClasses(params?: k8s.StorageV1ApiListStorageClassRequest): Promise<k8s.V1StorageClass[]> {
    return this.getAndCache<k8s.V1StorageClass>('storageclasses', () => this.kubeService.storageApi.listStorageClass(params), params);
  }

  getCacheStats(): { [key: string]: { age: number; itemCount: number } } {
    const now = Date.now();
    const stats: { [key: string]: { age: number; itemCount: number } } = {};

    for (const [key, value] of this.cache.entries()) {
      stats[key] = {
        age: now - value.timestamp,
        itemCount: value.data.length,
      };
    }

    return stats;
  }
}
