export type TProducts = {
  name: string;
  price: number;
  stockQuantity: number;
  description: string;
  image: string[];
  categoryId: string;
};


export type TProductFilterRequest = {
  searchTerm?: string;
  vendorId?: string;
  minPrice?: number;
  maxPrice?: number;
  stockQuantity?: number;
  flashSale?: boolean;
  category?: string;
};
