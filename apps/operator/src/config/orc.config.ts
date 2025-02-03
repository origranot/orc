import { z } from 'zod';
import { Injectable } from '@nestjs/common';

export const OrcConfigSchema = z.object({
  dryRun: z.boolean(),
  ageThresholdDays: z.number().int().positive(),
  batchSize: z.number().int().positive(),
  ignoreAnnotations: z.array(z.string()),
  consoleUrl: z.string().url(),
  clusterToken: z.string().optional(),
  registrationToken: z.string(),
  namespace: z.string(),
  operatorName: z.string(),
  scanFrequency: z.string(),
});

export type OrcConfigType = z.infer<typeof OrcConfigSchema>;

@Injectable()
export class OrcConfig implements OrcConfigType {
  dryRun: boolean;
  ageThresholdDays: number;
  batchSize: number;
  ignoreAnnotations: string[];
  consoleUrl: string;
  registrationToken: string;
  namespace: string;
  operatorName: string;
  scanFrequency: string;

  constructor(overrideConfig: Partial<OrcConfigType>) {
    const config = {
      dryRun: process.env.ORC_DRY_RUN !== 'false',
      ageThresholdDays: parseInt(process.env.ORC_AGE_THRESHOLD_DAYS || '7'),
      batchSize: parseInt(process.env.ORC_BATCH_SIZE || '10'),
      ignoreAnnotations: process.env.ORC_IGNORE_ANNOTATIONS?.split(',') || ['orc/ignore-resource'],
      consoleUrl: process.env.ORC_CONSOLE_URL,
      registrationToken: process.env.ORC_REGISTRATION_TOKEN,
      namespace: process.env.NAMESPACE || 'orc',
      operatorName: process.env.OPERATOR_NAME || 'orc-agent',
      scanFrequency: process.env.SCAN_FREQUENCY || '*/30 * * * *',
    };

    if (overrideConfig) {
      Object.assign(config, overrideConfig);
    }

    const validated = OrcConfigSchema.parse(config);
    Object.assign(this, validated);
  }
}
