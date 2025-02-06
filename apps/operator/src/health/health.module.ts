import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { KubeHealthIndicator } from './indicators/kube.indicator';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [KubeHealthIndicator],
})
export class HealthModule {}
