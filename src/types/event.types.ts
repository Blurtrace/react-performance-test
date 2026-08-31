import type { Category } from './category.types';

export interface EventImage {
  id: string;
  url: string;
  eventId?: string;
  createdAt?: string;
}

export interface Event {
  id: string;
  name: string;
  description?: string | null;
  date: string;
  location: string;
  price: number;
  capacity: number;
  category?: Category;
  categoryId: string;
  images?: EventImage[];
  createdAt?: string;
  updatedAt?: string;
}
