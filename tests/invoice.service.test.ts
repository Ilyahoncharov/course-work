import { EstimateService } from '../src/services/EstimateService';
import { InvoiceService } from '../src/services/InvoiceService';

describe('InvoiceService', () => {
  test('should create invoice from estimate with same amounts and items', () => {
    const estimateService = new EstimateService();

    const estimate = estimateService.create({
      number: 'EST-100',
      customerName: 'ACME Corp',
      items: [
        { description: 'Service A', quantity: 2, price: 200 }, // 400
        { description: 'Service B', quantity: 1, price: 100 }  // 100
      ]
    });

    const invoiceService = new InvoiceService(estimateService);

    const invoice = invoiceService.createFromEstimate(estimate.id);

    expect(invoice).toBeDefined();
    expect(invoice.estimateId).toBe(estimate.id);
    expect(invoice.customerName).toBe(estimate.customerName);
    expect(invoice.subtotal).toBe(estimate.subtotal);
    expect(invoice.total).toBeCloseTo(estimate.total);
    expect(invoice.items.length).toBe(estimate.items.length);
    expect(invoice.number.startsWith('INV-')).toBe(true);
  });

  test('should throw error for non-existing estimate', () => {
    const estimateService = new EstimateService();
    const invoiceService = new InvoiceService(estimateService);

    expect(() => invoiceService.createFromEstimate(999)).toThrow(
      'Estimate with id 999 not found'
    );
  });

  test('should throw error when invoice already exists for estimate', () => {
    const estimateService = new EstimateService();
    const invoiceService = new InvoiceService(estimateService);

    const estimate = estimateService.create({
      number: 'EST-200',
      customerName: 'Customer',
      items: [{ description: 'A', quantity: 1, price: 100 }]
    });

    invoiceService.createFromEstimate(estimate.id);

    expect(() => invoiceService.createFromEstimate(estimate.id)).toThrow(
      'Invoice for this estimate already exists'
    );
  });

  test('should throw error when total is zero', () => {
    const estimateService = new EstimateService();
    const invoiceService = new InvoiceService(estimateService);

    const estimate = estimateService.create({
      number: 'EST-300',
      customerName: 'Zero Total',
      items: [{ description: 'Free', quantity: 0, price: 100 }]
    });

    expect(estimate.total).toBe(0);

    expect(() => invoiceService.createFromEstimate(estimate.id)).toThrow(
      'Invoice cannot be created from estimate with zero total'
    );
  });
});