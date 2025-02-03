import { Module } from '@nestjs/common';
import { KubeModule } from '../kube/kube.module';
import { ScannerService } from './scanner.service';
import { NamespaceScanner, ServiceScanner, IngressScanner, PdbScanner, StorageClassScanner, PersistentVolumeScanner, RoleScanner } from './scanners';
import { SCANNERS_TOKEN } from './scanners.token';

const SCANNERS = [NamespaceScanner, ServiceScanner, IngressScanner, PdbScanner, StorageClassScanner, PersistentVolumeScanner, RoleScanner];

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
