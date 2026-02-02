export interface CreateProduct {
  name: string;
  description?: string | null;
  categoryId: string;
  price: number;
  image: string;
  brandId?: string | null;
  discount?: number;
  isActive?: boolean;
  diets?: string[] | undefined;
}

export interface Category {
  id: string;
  name: string;
  slug?: string;
  image?: string;
  description?: string;
  isActive: boolean;
  discount?: number;
  discountStart?: Date;
  discountEnd?: Date;
  providerId: string;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Brand {
  id: string;
  name: string;
  providerId: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  website?: string;
  instagram?: string;
  discount?: number;
  facebook?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CreateBrandPayload = {
  name: string;
  slug?: string;
  image?: string;
  description?: string;
  website?: string;
  instagram?: string;
  discount?: number;
  facebook?: string;
  discountStart?: Date;
  discountEnd?: Date;
};

export interface CreateDiet {
  id: string;
  name: string;
  isActive?: boolean | true;
  slug: string;
  description?: string | null;
}


export interface CreateOrderPayload {
  userId: string;
  totalPrice: number;
  deliveryAddress: string;
  grandTotal: number;
  phone: string;
  totalDiscount?: number;
  totalQuantity: number;
  notes?: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
    discount?: number;
  }[];
}
