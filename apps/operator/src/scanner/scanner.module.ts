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
} from './scanners';
import { SCANNERS_TOKEN } from './scanners.token';
import { DeploymentScanner } from './scanners/deployment.scanner';
import { StatefulSetScanner } from './scanners/statefulset.scanner';

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
