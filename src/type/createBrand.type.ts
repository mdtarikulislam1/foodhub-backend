// src/dto/brand.dto.ts
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
