export type TOrder = {
  vendorId: string;
  transactionId: string;
  totalPrice: number;
  deliveryAddress?: string;
  coupon?: string;
  orderDetails: {
    productId: string;
    quantity: number;
    pricePerUnit: number;
  }[];
};

export type TOrderFilterRequest = {
  vendorId?: string;
  customerId?: string;
};


export const orderFilterableFields: string[] = ['vendorId', 'customerId'];