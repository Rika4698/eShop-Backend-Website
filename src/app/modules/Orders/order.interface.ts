export type TOrder = {
  vendorId: string;
  totalPrice: number;
  deliveryAddress?: string;
  phone?:string;
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