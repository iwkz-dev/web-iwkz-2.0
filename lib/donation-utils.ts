import { DonationPackageData } from '@/types/donationApi';

export function isDonationNotExpired(dateStr: string | null): boolean {
  if (!dateStr) return true;

  const endDate = new Date(dateStr);
  return endDate >= new Date();
}

export function validateDonationPackages(
  data: DonationPackageData
): DonationPackageData {
  return {
    ...data,
    donationPackages:
      data.donationPackages.filter(
        ({ published, endDate }) => published && isDonationNotExpired(endDate)
      ) || [],
  };
}
