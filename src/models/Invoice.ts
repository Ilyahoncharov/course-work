import { EstimateItem } from './Estimate';

export interface Invoice {
  id: number;
  number: string;
  createdAt: Date;
  customerName: string;
  items: EstimateItem[];
  subtotal: number;
  tax: number;
  total: number;
  estimateId: number;
}