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
