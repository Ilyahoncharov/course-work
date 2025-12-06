import { Estimate, EstimateItem, EstimateItemInput } from '../models/Estimate';

export interface EstimateCreatePayload {
  number: string;
  customerName: string;
  items: EstimateItemInput[];
}

export class EstimateService {
  private estimates: Estimate[] = [];
  private nextId = 1;
  private readonly TAX_RATE = 0.2; // 20%

  getAll(): Estimate[] {
    return this.estimates;
  }

  getById(id: number): Estimate | undefined {
    return this.estimates.find(e => e.id === id);
  }

  create(data: EstimateCreatePayload): Estimate {
    const items = this.normalizeItems(data.items);
    const amounts = this.calculateAmounts(items);

    const estimate: Estimate = {
      id: this.nextId++,
      createdAt: new Date(),
      number: data.number,
      customerName: data.customerName,
      items,
      subtotal: amounts.subtotal,
      tax: amounts.tax,
      total: amounts.total
    };

    this.estimates.push(estimate);
    return estimate;
  }

  update(id: number, data: EstimateCreatePayload): Estimate | null {
    const index = this.estimates.findIndex(e => e.id === id);
    if (index === -1) {
      return null;
    }

    const items = this.normalizeItems(data.items);
    const amounts = this.calculateAmounts(items);

    const updated: Estimate = {
      ...this.estimates[index],
      number: data.number,
      customerName: data.customerName,
      items,
      subtotal: amounts.subtotal,
      tax: amounts.tax,
      total: amounts.total
    };

    this.estimates[index] = updated;
    return updated;
  }

  delete(id: number): boolean {
    const index = this.estimates.findIndex(e => e.id === id);
    if (index === -1) {
      return false;
    }

    this.estimates.splice(index, 1);
    return true;
  }

  // ===== ВНУТРЕННЯЯ ЛОГИКА =====

  private normalizeItems(items: EstimateItemInput[]): EstimateItem[] {
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('Estimate must contain at least one item');
    }

    return items.map<EstimateItem>(item => {
      if (!item.description || typeof item.description !== 'string') {
        throw new Error('Item description is required');
      }

      if (typeof item.quantity !== 'number' || item.quantity < 0) {
        throw new Error('Item quantity must be a non-negative number');
      }

      if (typeof item.price !== 'number' || item.price < 0) {
        throw new Error('Item price must be a non-negative number');
      }

      const total = item.quantity * item.price;
      return {
        ...item,
        total
      };
    });
  }

  private calculateAmounts(items: EstimateItem[]): {
    subtotal: number;
    tax: number;
    total: number;
  } {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * this.TAX_RATE;
    const total = subtotal + tax;

    return { subtotal, tax, total };
  }
}