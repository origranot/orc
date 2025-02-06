import { Provider } from '@prisma/client';
import { Icons } from '@orc/web/ui/custom-ui';

export function ProviderIcon({ provider }: { provider: Provider }) {
  const size = 'h-4 w-4';

  switch (provider) {
    case 'AWS':
      return <Icons.aws className={size} />;
    case 'AZURE':
      return <Icons.azure className={size} />;
    case 'GCP':
      return <Icons.gcp className={size} />;
    case 'DIGITALOCEAN':
      return <Icons.digitalocean className={size} />;
    default:
      return <Icons.kubernetes className={size} />;
  }
}
