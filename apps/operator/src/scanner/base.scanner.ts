import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { CleanupResult, K8sResource } from '../types';

@Injectable()
export abstract class BaseResourceScanner<T extends K8sResource> {
  protected readonly logger: Logger;

  constructor(protected readonly configService: ConfigService) {
    this.logger = new Logger(this.constructor.name);
  }

  // This method is called before the scan method is called. It can be used to perform any pre-scan operations.
  preScan?(): Promise<void>;

  abstract scan(): Promise<T[]>;
  abstract isOrphaned(resource: T): Promise<{ isOrphaned: boolean; reason?: string }>;
  cleanup?(resource: T): Promise<CleanupResult<T>>;

  shouldProcess(resource: T): boolean {
    const annotations = resource.metadata?.annotations || {};
    return !this.configService.get().ignoreAnnotations.some((annotation) => annotations[annotation] === 'true');
  }
}