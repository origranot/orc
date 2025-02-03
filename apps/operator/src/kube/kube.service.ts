import { Injectable, Logger } from '@nestjs/common';
import * as k8s from '@kubernetes/client-node';

@Injectable()
export class KubeService {
  private kc: k8s.KubeConfig;
  private _coreApi: k8s.CoreV1Api;
  private _appsApi: k8s.AppsV1Api;
  private _networkingApi: k8s.NetworkingV1Api;
  private _policyApi: k8s.PolicyV1Api;
  private _storageApi: k8s.StorageV1Api;
  private _versionApi: k8s.VersionApi;
  private _rbacApi: k8s.RbacAuthorizationV1Api;


  private logger = new Logger(KubeService.name);

  constructor() {
    this.kc = new k8s.KubeConfig();
    this.kc.loadFromDefault();

    this._coreApi = this.kc.makeApiClient(k8s.CoreV1Api);
    this._appsApi = this.kc.makeApiClient(k8s.AppsV1Api);
    this._networkingApi = this.kc.makeApiClient(k8s.NetworkingV1Api);
    this._policyApi = this.kc.makeApiClient(k8s.PolicyV1Api);
    this._storageApi = this.kc.makeApiClient(k8s.StorageV1Api);
    this._versionApi = this.kc.makeApiClient(k8s.VersionApi);
    this._rbacApi = this.kc.makeApiClient(k8s.RbacAuthorizationV1Api);

  }

  get client() {
    return this.kc;
  }

  get coreApi() {
    return this._coreApi;
  }

  get appsApi() {
    return this._appsApi;
  }

  get networkingApi() {
    return this._networkingApi;
  }

  get policyApi() {
    return this._policyApi;
  }

  get storageApi() {
    return this._storageApi;
  }

  get rbacApi() {
    return this._rbacApi;
  }

  async getClusterVersion(): Promise<string> {
    try {
      const version = await this._versionApi.getCode();
      return version.gitVersion;
    } catch (error) {
      this.logger.error(`Failed to get cluster version: ${error.message}`);
      throw error;
    }
  }

  async getNodeCount(): Promise<number> {
    try {
      const nodes = await this._coreApi.listNode();
      return nodes.items.length;
    } catch (error) {
      this.logger.error(`Failed to get node count: ${error.message}`);
      throw error;
    }
  }
}
