import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob, CronJobParams } from 'cron';
import { Logger } from '@nestjs/common';

export interface BaseJobConfig {
  /**
   * A custom name for the job.
   * Defaults to the class name if not provided.
   */
  jobName?: string;

  /**
   * If true, the job's logic will execute immediately after registration.
   */
  runAtInit?: boolean;

  /**
   * Additional CronJob options that will be merged with the defaults.
   */
  cronOpts?: Partial<CronJobParams>;
}

export abstract class BaseJob {
  protected readonly logger: Logger;
  protected readonly jobName: string;
  protected readonly runAtInit: boolean;
  protected readonly cronOpts: Partial<CronJobParams>;
  private isRunning = false;

  constructor(protected readonly schedulerRegistry: SchedulerRegistry, opts?: BaseJobConfig) {
    this.logger = new Logger(this.constructor.name);
    this.jobName = opts?.jobName || this.constructor.name;
    this.runAtInit = opts?.runAtInit || false;
    this.cronOpts = opts?.cronOpts || {};
  }

  protected abstract getCronExpression(): string;
  protected abstract handleJob(): Promise<void>;

  public register(): void {
    const cronExpression = this.getCronExpression();

    const job = new CronJob(cronExpression, async () => {
      if (this.isRunning) {
        this.logger.warn(`Job "${this.jobName}" is already running. Skipping this tick.`);
        return;
      }
      this.isRunning = true;
      try {
        await this.handleJob();
      } catch (error) {
        this.logger.error(`Error executing job "${this.jobName}": ${error.message}`);
      } finally {
        this.isRunning = false;
      }
    });

    this.schedulerRegistry.addCronJob(this.jobName, job);
    job.start();
    this.logger.log(`Job "${this.jobName}" registered with cron expression: ${cronExpression}`);

    if (this.runAtInit) {
      this.logger.log(`runAtInit flag is true – attempting to run job "${this.jobName}" immediately.`);
      if (!this.isRunning) {
        this.isRunning = true;
        this.handleJob()
          .catch((error) => this.logger.error(`Error executing job "${this.jobName}" on init: ${error.message}`))
          .finally(() => (this.isRunning = false));
      } else {
        this.logger.warn(`Job "${this.jobName}" is already running at init, so immediate execution is skipped.`);
      }
    }
  }
}
