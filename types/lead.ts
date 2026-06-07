export type Lead = {
  id: string;
  businessName: string;
  category: string;
  phone: string;
  website: string;
  rating: number;
  reviewCount: number;
  score: "LOW" | "MEDIUM" | "HIGH";
};