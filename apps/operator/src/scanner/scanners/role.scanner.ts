import { Injectable, Logger } from '@nestjs/common';
import { BaseResourceScanner } from '../base.scanner';
import * as k8s from '@kubernetes/client-node';
import { KubeService } from '../../kube/kube.service';
import { ConfigService } from '../../config/config.service';
import { CleanupResult } from '../../types';
import { enrichKubernetesObject } from '../../utils/kube';

@Injectable()
export class RoleScanner extends BaseResourceScanner<k8s.V1Role> {
  constructor(private readonly kubeService: KubeService, config: ConfigService) {
    super(config);
  }

  async scan(): Promise<k8s.V1Role[]> {
    try {
      const response = await this.kubeService.rbacApi.listRoleForAllNamespaces();
      return response.items.map((role) => enrichKubernetesObject(role, 'role'));
    } catch (error) {
      this.logger.error(`Failed to scan roles: ${error.message}`);
      throw error;
    }
  }

  async isOrphaned(role: k8s.V1Role): Promise<{ isOrphaned: boolean; reason?: string }> {
    try {
      if (!role.rules || role.rules.length === 0) {
        return {
          isOrphaned: true,
          reason: 'Role has no rules defined',
        };
      }

      const roleBindings = await this.kubeService.rbacApi.listRoleBindingForAllNamespaces();

      const isReferenced = roleBindings.items.some((binding) => {
        return (
          binding.roleRef.kind === 'Role' &&
          binding.roleRef.name === role.metadata.name &&
          binding.metadata.namespace === role.metadata.namespace
        );
      });

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
    try {
      if (!role.metadata?.name || !role.metadata?.namespace) {
        throw new Error('Role name or namespace is undefined');
      }

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
