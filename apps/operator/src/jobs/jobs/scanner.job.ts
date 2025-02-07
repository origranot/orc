import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ConfigService } from '../../config/config.service';
import { BaseJob } from '../base.job';
import { ScannerService } from '../../scanner/scanner.service';
import { ReporterService } from '../../reporter/reporter.service';

@Injectable()
export class ScannerJob extends BaseJob {
  constructor(
    schedulerRegistry: SchedulerRegistry,
    private readonly configService: ConfigService,
    private readonly scannerService: ScannerService,
    private readonly reporterService: ReporterService,
  ) {
    super(schedulerRegistry, { jobName: 'ScannerJob', runAtInit: true });
  }

  protected getCronExpression(): string {
    return this.configService.get().scanFrequency;
  }

  protected async handleJob(): Promise<void> {
    const results = await this.scannerService.scan();
    this.logger.log(`Scan completed. Found ${results.summary.totalOrphaned} orphaned resources.`);
    await this.reporterService.sendOrphanedResourcesReport(results);
  }
}
