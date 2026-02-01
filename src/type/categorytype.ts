
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

