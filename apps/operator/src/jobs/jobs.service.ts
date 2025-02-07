import { Injectable, OnModuleInit, Logger, Inject } from '@nestjs/common';
import { JOBS_TOKEN } from './jobs.token';
import { BaseJob } from './base.job';

@Injectable()
export class JobsService implements OnModuleInit {
  private readonly logger = new Logger(JobsService.name);

  constructor(@Inject(JOBS_TOKEN) private readonly jobs: BaseJob[]) {}

  onModuleInit() {
    this.logger.log('Registering all jobs...');
    this.jobs.forEach((job) => job.register());
  }
}
