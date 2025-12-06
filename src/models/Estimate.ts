export interface EstimateItemInput {
    description: string;
    quantity: number;
    price: number;
  }
  
  export interface EstimateItem extends EstimateItemInput {
    total: number;
  }
  
  export interface Estimate {
    id: number;
    number: string;
    createdAt: Date;
    customerName: string;
    items: EstimateItem[];
    subtotal: number;
    tax: number;
    total: number;
  }