import { Module } from '@nestjs/common';
import { ScannerService } from './scanner.service';
import {
  NamespaceScanner,
  ServiceScanner,
  IngressScanner,
  PdbScanner,
  StorageClassScanner,
  PersistentVolumeScanner,
  NodeScanner,
  RoleScanner,
  DeploymentScanner,
  StatefulSetScanner,
  PodScanner,
} from './scanners';
import { SCANNERS_TOKEN } from './scanners.token';

const SCANNERS = [
  NamespaceScanner,
  ServiceScanner,
  IngressScanner,
  PdbScanner,
  StorageClassScanner,
  PersistentVolumeScanner,
  NodeScanner,
  RoleScanner,
  DeploymentScanner,
  StatefulSetScanner,
  PodScanner,
];

@Module({
  providers: [
    ...SCANNERS,
    {
      provide: SCANNERS_TOKEN,
      useFactory: (...scanners) => scanners,
      inject: [...SCANNERS],
    },
    ScannerService,
  ],
  exports: [ScannerService, SCANNERS_TOKEN],
})
export class ScannerModule {}
