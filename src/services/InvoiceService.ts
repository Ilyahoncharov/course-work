import { Invoice } from '../models/Invoice';
import { EstimateService } from './EstimateService';

export class InvoiceService {
  private invoices: Invoice[] = [];
  private nextId = 1;

  constructor(private readonly estimateService: EstimateService) {}

  getAll(): Invoice[] {
    return this.invoices;
  }

  getById(id: number): Invoice | undefined {
    return this.invoices.find(i => i.id === id);
  }

  delete(id: number): boolean {
    const index = this.invoices.findIndex(i => i.id === id);
    if (index === -1) {
      return false;
    }

    this.invoices.splice(index, 1);
    return true;
  }

  createFromEstimate(estimateId: number): Invoice {
    const estimate = this.estimateService.getById(estimateId);

    if (!estimate) {
      throw new Error(`Estimate with id ${estimateId} not found`);
    }

    if (estimate.total <= 0) {
      throw new Error('Invoice cannot be created from estimate with zero total');
    }

    const existingInvoice = this.findByEstimateId(estimateId);
    if (existingInvoice) {
      throw new Error('Invoice for this estimate already exists');
    }

    const invoice: Invoice = {
      id: this.nextId++,
      createdAt: new Date(),
      number: this.generateInvoiceNumber(),
      customerName: estimate.customerName,
      items: estimate.items.map(item => ({ ...item })), // копируем
      subtotal: estimate.subtotal,
      tax: estimate.tax,
      total: estimate.total,
      estimateId: estimate.id
    };

    this.invoices.push(invoice);
    return invoice;
  }

  // ===== ВНУТРЕННЯЯ ЛОГИКА =====

  private generateInvoiceNumber(): string {
    return `INV-${String(this.nextId).padStart(4, '0')}`;
    // INV-0001, INV-0002, ...
  }

  private findByEstimateId(estimateId: number): Invoice | undefined {
    return this.invoices.find(i => i.estimateId === estimateId);
  }
}