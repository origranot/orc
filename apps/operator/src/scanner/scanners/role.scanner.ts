import { Injectable } from '@nestjs/common';
import { BaseResourceScanner } from '../base.scanner';
import * as k8s from '@kubernetes/client-node';
import { KubeService } from '../../kube/kube.service';
import { ConfigService } from '../../config/config.service';
import { CleanupResult } from '../../types';
import { enrichKubernetesObject } from '../../utils/kube';
import { KubeCache } from '../../kube/cache/kube-cache.service';

@Injectable()
export class RoleScanner extends BaseResourceScanner<k8s.V1Role> {
  private roleBindingsMap = new Map<string, boolean>();

  constructor(private readonly kubeService: KubeService, private readonly kubeCache: KubeCache, config: ConfigService) {
    super(config);
  }

  async preScan(): Promise<void> {
    try {
      this.roleBindingsMap.clear();
      const roleBindings = await this.kubeCache.getAllRoleBindings();

      roleBindings.forEach((binding) => {
        if (binding.roleRef.kind === 'Role') {
          const key = `${binding.metadata.namespace}/${binding.roleRef.name}`;
          this.roleBindingsMap.set(key, true);
        }
      });
    } catch (error) {
      this.logger.error(`Failed to pre-scan role bindings: ${error.message}`);
      throw error;
    }
  }

  async scan(): Promise<k8s.V1Role[]> {
    try {
      const response = await this.kubeCache.getAllRoles();
      return response.map((role) => enrichKubernetesObject(role, 'Role'));
    } catch (error) {
      this.logger.error(`Failed to scan roles: ${error.message}`);
      throw error;
    }
  }

  async isOrphaned(role: k8s.V1Role): Promise<{ isOrphaned: boolean; reason?: string }> {
    try {
      if (!role.rules?.length) {
        return {
          isOrphaned: true,
          reason: 'Role has no rules defined',
        };
      }

      const roleKey = `${role.metadata.namespace}/${role.metadata.name}`;
      const isReferenced = this.roleBindingsMap.has(roleKey);

      if (!isReferenced) {
        return {
          isOrphaned: true,
          reason: 'Role is not referenced by any RoleBinding',
        };
      }

      return {
        isOrphaned: false,
      };
    } catch (error) {
      this.logger.error(`Failed to check role ${role.metadata.namespace}/${role.metadata.name}: ${error.message}`);
      throw error;
    }
  }

  async cleanup(role: k8s.V1Role): Promise<CleanupResult<k8s.V1Role>> {
    if (!role.metadata?.name || !role.metadata?.namespace) {
      return {
        resource: role,
        success: false,
        error: 'Role name or namespace is undefined',
      };
    }

    try {
      await this.kubeService.rbacApi.deleteNamespacedRole({
        name: role.metadata.name,
        namespace: role.metadata.namespace,
      });

      return {
        resource: role,
        success: true,
      };
    } catch (error) {
      return {
        resource: role,
        success: false,
        error: error.message,
      };
    }
  }
}
