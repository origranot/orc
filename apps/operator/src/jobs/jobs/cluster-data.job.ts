import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { BaseJob } from '../base.job';
import { KubeService } from '../../kube/kube.service';
import { ConfigService } from '../../config/config.service';
import { ReporterService } from '../../reporter/reporter.service';
import { KubeCache } from '../../kube/cache/kube-cache.service';

@Injectable()
export class ClusterDataJob extends BaseJob {
  constructor(
    schedulerRegistry: SchedulerRegistry,
    private readonly configService: ConfigService,
    private readonly kubeService: KubeService,
    private readonly kubeCache: KubeCache,
    private readonly reporterService: ReporterService,
  ) {
    super(schedulerRegistry, { jobName: 'ClusterDataJob', runAtInit: false });
  }

  protected getCronExpression(): string {
    return this.configService.get().updateFrequency;
  }

  protected async handleJob(): Promise<void> {
    const version = await this.kubeService.getClusterVersion();
    const nodes = await this.kubeCache.getNodes();
    await this.reporterService.sendClusterDataReport(version, nodes.length);
    this.logger.log(`Cluster data report sent. Version: ${version}, Nodes: ${nodes.length}`);
  }
}
