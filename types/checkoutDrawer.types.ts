import type { getTranslations } from '@/lib/translations';
import type { CartItem } from '@/types/donationApi';

export type CheckoutDrawerText = ReturnType<
  typeof getTranslations
>['checkoutDrawer'];

export interface SubpackageListProps {
  items: CartItem[];
  t: CheckoutDrawerText;
  setQuantity: (uniqueCode: string, quantity: number) => void;
  setDonatorInfo: (uniqueCode: string, info: string) => void;
}

export interface SingleDonatorInfoProps {
  item?: CartItem;
  t: CheckoutDrawerText;
  setDonatorInfo: (uniqueCode: string, info: string) => void;
}
