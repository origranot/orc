import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import axios from 'axios';
import { KubeService } from '../kube/kube.service';
import { ConfigService } from '../config/config.service';

@Injectable()
export class TokenManagerService implements OnModuleInit {
  private readonly logger = new Logger(TokenManagerService.name);
  private clusterToken: string | null = null;

  constructor(private readonly kubeService: KubeService, private readonly configService: ConfigService) {}

  async onModuleInit() {
    await this.initializeToken();
  }

  private getSecretName(): string {
    return `${this.configService.get().operatorName}-cluster-token`;
  }

  async initializeToken(): Promise<void> {
    try {
      const existingToken = await this.getStoredToken();

      if (existingToken) {
        this.logger.log('Initializing cluster token from stored secret');
        this.clusterToken = existingToken;
        return;
      }

      const config = this.configService.get();
      if (!config.registrationToken) {
        throw new Error('Registration token is required for initial cluster setup');
      }

      this.logger.log('No existing token found, initiating cluster registration');
      await this.registerCluster();
    } catch (error) {
      this.logger.error('Failed to initialize cluster token, operator will exit:', error);
      process.exit(1);
    }
  }

  async getStoredToken(): Promise<string | null> {
    if (this.clusterToken) {
      return this.clusterToken;
    }

    try {
      const secretName = this.getSecretName();
      const secret = await this.kubeService.coreApi.readNamespacedSecret({
        name: secretName,
        namespace: this.configService.get().namespace,
      });

      const tokenBuffer = Buffer.from(secret.data.token, 'base64');
      this.clusterToken = tokenBuffer.toString('utf-8');
      return this.clusterToken;
    } catch (error) {
      if (error.code !== 404) {
        this.logger.error(`Error reading token secret: ${error.message}`);
      }
      return null;
    }
  }

  private async storeToken(token: string): Promise<void> {
    const secretName = this.getSecretName();
    const config = this.configService.get();

    const secretManifest = {
      apiVersion: 'v1',
      kind: 'Secret',
      metadata: {
        name: secretName,
        labels: {
          'app.kubernetes.io/managed-by': config.operatorName,
          'app.kubernetes.io/created-by': 'token-manager',
        },
      },
      type: 'Opaque',
      data: {
        token: Buffer.from(token).toString('base64'),
      },
    };

    try {
      await this.kubeService.coreApi.createNamespacedSecret({
        namespace: config.namespace,
        body: secretManifest,
      });
      this.clusterToken = token;
      this.logger.log('Cluster token stored successfully');
    } catch (error) {
      if (error.code === 409) {
        this.logger.warn('Token secret already exists, skipping creation');
      } else {
        throw error;
      }
    }
  }

  private async registerCluster(): Promise<void> {
    const config = this.configService.get();

    try {
      const [version, nodes] = await Promise.all([this.kubeService.getClusterVersion(), this.kubeService.coreApi.listNode()]);
      const clusterInfo = {
        version,
        nodes: nodes.items,
      };

      const response = await axios.post(
        `${config.consoleUrl}/api/clusters/register`,
        {
          token: config.registrationToken,
          clusterInfo,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const { token: permanentToken } = response.data;
      await this.storeToken(permanentToken);
    } catch (error) {
      this.logger.error('Cluster registration failed:', error);
      throw new Error('Failed to register cluster with console');
    }
  }

  getToken(): string {
    if (!this.clusterToken) {
      throw new Error('Cluster token not initialized');
    }
    return this.clusterToken;
  }
}
