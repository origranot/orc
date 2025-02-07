import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JOBS_TOKEN } from './jobs.token';
import { ScannerJob } from './jobs/scanner.job';
import { ClusterDataJob } from './jobs/cluster-data.job';
import { ScheduleModule } from '@nestjs/schedule';
import { BaseJob } from './base.job';
import { ScannerModule } from '../scanner/scanner.module';
import { ReporterModule } from '../reporter/reporter.module';
import { TokenManagerModule } from '../token-manager/token-manager.module';

const JOBS = [ScannerJob, ClusterDataJob];

@Module({
  imports: [ScheduleModule.forRoot(), TokenManagerModule, ScannerModule, ReporterModule],
  providers: [
    ...JOBS,
    {
      provide: JOBS_TOKEN,
      useFactory: (...jobs: BaseJob[]) => jobs,
      inject: [...JOBS],
    },
    JobsService,
  ],
  exports: [JobsService],
})
export class JobsModule {}
