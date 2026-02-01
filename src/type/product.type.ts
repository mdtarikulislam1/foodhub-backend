export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image: string;
  isActive: boolean;
  brandId: string;
  createdAt: Date;
  updatedAt: Date;
}
