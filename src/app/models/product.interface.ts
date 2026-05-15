export interface Product {
  id?: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  createdAt?: number; 
}