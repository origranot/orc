import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { KubeModule } from './kube/kube.module';
import { ConfigModule } from './config/config.module';
import { HealthModule } from './health/health.module';
import { JobsModule } from './jobs/jobs.module';
import { TokenManagerModule } from './token-manager/token-manager.module';

@Module({
  imports: [ConfigModule.forRoot(), TokenManagerModule, JobsModule, KubeModule, HealthModule],
  providers: [AppService],
})
export class AppModule {}
