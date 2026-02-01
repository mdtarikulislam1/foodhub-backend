export interface CreateProduct {
  name: string;
  description?: string | null;
  categoryId: string;
  price: number;
  image: string;
  brandId?: string | null;
  discount?: number;
  isActive?: boolean;
}
