import { DiscountStatus } from '@prisma/client';

export interface ICoupon {
  code: string;
  discountStatus: DiscountStatus;
  discountValue: number;
  endDate: Date;
}