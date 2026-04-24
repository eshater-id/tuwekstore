export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  sizes: string[];
  colors: string[];
  stock: "available" | "out_of_stock";
  featured?: boolean;
  clicks: number;
  createdAt: number;
}

export interface Banner {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  link: string;
  active: boolean;
}

export interface StoreSettings {
  whatsappNumber: string;
  storeName: string;
  storeAddress: string;
  googleMapsUrl: string;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  avatar?: string;
}
