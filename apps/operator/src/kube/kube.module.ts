import { Global, Module } from '@nestjs/common';
import { KubeService } from './kube.service';
import { KubeCache } from './cache/kube-cache.service';

@Global()
@Module({
  providers: [KubeService, KubeCache],
  exports: [KubeService, KubeCache],
})
export class KubeModule {}
