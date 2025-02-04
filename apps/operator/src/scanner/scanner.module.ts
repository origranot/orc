import { Module } from '@nestjs/common';
import { KubeModule } from '../kube/kube.module';
import { ScannerService } from './scanner.service';
import { NamespaceScanner, ServiceScanner, IngressScanner, PdbScanner, StorageClassScanner, PersistentVolumeScanner, NodeScanner } from './scanners';
import { SCANNERS_TOKEN } from './scanners.token';

const SCANNERS = [
  NodeScanner,
];

@Module({
  imports: [KubeModule],
  providers: [
    ...SCANNERS,
    {
      provide: SCANNERS_TOKEN,
      useFactory: (...scanners) => scanners,
      inject: [...SCANNERS],
    },
    ScannerService,
  ],
  exports: [ScannerService],
})
export class ScannerModule {}
