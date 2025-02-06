import { V1Node } from '@kubernetes/client-node';
import { Provider } from '@prisma/client';
import { detectRegionFromNode } from './region';

export function extractProviderDetailsFromNode(node: V1Node): { provider: Provider; region?: string } {
  const provider = detectProviderFromNode(node);
  const region = detectRegionFromNode(node);

  return { provider, region };
}

function detectProviderFromNode(node: V1Node): Provider {
  const providerId = node.spec?.providerID;
  if (!providerId) return Provider.OTHER;

  if (providerId.includes('aws')) return Provider.AWS;
  if (providerId.includes('gce')) return Provider.GCP;
  if (providerId.includes('azure')) return Provider.AZURE;
  if (providerId.includes('digitalocean')) return Provider.DIGITALOCEAN;

  return Provider.OTHER;
}
