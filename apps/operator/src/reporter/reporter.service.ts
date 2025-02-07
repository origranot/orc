import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { BatchScanReport } from '../types';
import axios from 'axios';
import { TokenManagerService } from '../token-manager/token-manager.service';

@Injectable()
export class ReporterService {
  constructor(private readonly configService: ConfigService, private readonly tokenManagerService: TokenManagerService) {}

  async sendOrphanedResourcesReport(report: BatchScanReport) {
    const payload = {
      timestamp: report.timestamp,
      orphanedResources: report.reports.flatMap((r) =>
        r.orphanedResources.map(({ resource, reason }) => ({
          kind: resource.kind,
          name: resource.metadata.name,
          namespace: resource.metadata.namespace,
          uid: resource.metadata.uid,
          owner: resource.metadata.ownerReferences?.[0],
          discoveredAt: new Date(),
          age: resource.metadata.creationTimestamp,
          reason,
          labels: resource.metadata.labels,
          annotations: resource.metadata.annotations,
          spec: resource.spec,
        })),
      ),
      summary: report.summary,
    };

    await axios.post(`${this.configService.get().consoleUrl}/api/clusters/orphaned-resources`, payload, {
      headers: {
        Authorization: `Bearer ${this.tokenManagerService.getToken()}`,
      },
    });
  }

  async sendClusterDataReport(version: string, nodesCount: number) {
    const payload = {
      version,
      nodesCount,
    };

    await axios.post(`${this.configService.get().consoleUrl}/api/clusters/data`, payload, {
      headers: {
        Authorization: `Bearer ${this.tokenManagerService.getToken()}`,
      },
    });
  }
}
