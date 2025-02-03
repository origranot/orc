import { getAwsVolumePrice } from "@orc/costs"
const convertStorageToGB = (storage: string): number | undefined => {
    const regex = /(\d+(?:\.\d+)?)\s*([KMG]i?)?/i; // Regex to extract number and unit
    const match = storage.match(regex);
  
    if (!match) {
      throw new Error("Invalid storage format");
    }
  
    const size = parseFloat(match[1]); // Extracted number
    const unit = match[2]?.toLowerCase(); // Extracted unit
  
    // Conversion based on the unit
    switch (unit) {
      case 'gi':
        return size * 1; // 1 GiB = 1 GiB
      case 'g':
        return size; // Already in GB
      case 'mi':
        return size / 1024; // 1 MiB = 1/1024 GiB
      case 'm':
        return size / 1024; // 1 MB = 1/1024 GB
      case 'ki':
        return size / (1024 * 1024); // 1 KiB = 1/(1024^2) GiB
      case 'k':
        return size / (1024 * 1024); // 1 KB = 1/(1024^2) GB
      default:
        return undefined;
    }
  }

export const getPvcCost = async (pvc: OrphanedResource<PVSpec>): Promise<number | undefined> => {
    const storageSize = pvc.spec?.capacity.storage;
    if (storageSize !== undefined) {
        const storageSizeGB = convertStorageToGB(storageSize);
        if (storageSizeGB !== undefined) {
            return await getAwsVolumePrice(storageSizeGB);
        }
    }
}