export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProviderProfile {
  id: string;
  name: string;
  logo?: string;
  coverImage?: string;
  description?: string;
  phone: string;
  address?: string;
  isActive: boolean;
  workingHours?: string;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateProviderProfile {
  name?: string;
  logo?: string;
  coverImage?: string;
  description?: string;
  phone?: string;
  address?: string;
  workingHours?: string;
}
