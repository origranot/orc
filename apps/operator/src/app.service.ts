import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { TokenManagerService } from './token-manager/token-manager.service';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly tokenManager: TokenManagerService) {}

  async onModuleInit() {
    try {
      this.tokenManager.getToken();
      this.logger.log(`Cluster token initialized`);
    } catch (error) {
      this.logger.error('Failed to initialize operator:', error);
      throw new Error('Operator initialization failed - cluster registration required');
    }
  }
}
