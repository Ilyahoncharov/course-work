import { EstimateService } from '../src/services/EstimateService';

describe('EstimateService', () => {
  test('should create estimate and calculate totals', () => {
    const service = new EstimateService();

    const created = service.create({
      number: 'EST-001',
      customerName: 'Test Customer',
      items: [
        { description: 'Item A', quantity: 2, price: 100 },
        { description: 'Item B', quantity: 1, price: 50 }
      ]
    });

    expect(created.id).toBeGreaterThan(0);
    expect(created.items.length).toBe(2);

    // subtotal = 2*100 + 1*50 = 250
    expect(created.subtotal).toBe(250);
    // tax = 20% от 250 = 50
    expect(created.tax).toBeCloseTo(50);
    // total = 300
    expect(created.total).toBeCloseTo(300);
  });

  test('should not allow empty items', () => {
    const service = new EstimateService();

    expect(() =>
      service.create({
        number: 'EST-002',
        customerName: 'Empty Items',
        items: []
      })
    ).toThrow('Estimate must contain at least one item');
  });

  test('should update estimate and recalculate totals', () => {
    const service = new EstimateService();

    const created = service.create({
      number: 'EST-003',
      customerName: 'Customer',
      items: [{ description: 'A', quantity: 1, price: 100 }]
    });

    const updated = service.update(created.id, {
      number: 'EST-004',
      customerName: 'Updated Customer',
      items: [
        { description: 'A', quantity: 3, price: 100 }, // 300
        { description: 'B', quantity: 2, price: 50 }   // 100
      ]
    });

    expect(updated).not.toBeNull();
    expect(updated!.number).toBe('EST-004');
    expect(updated!.subtotal).toBe(400); // 300 + 100
    expect(updated!.total).toBeCloseTo(400 * 1.2); // с налогом
  });

  test('should return null when updating non-existing estimate', () => {
    const service = new EstimateService();

    const updated = service.update(999, {
      number: 'X',
      customerName: 'Y',
      items: [{ description: 'A', quantity: 1, price: 10 }]
    });

    expect(updated).toBeNull();
  });

  test('should delete existing estimate', () => {
    const service = new EstimateService();

    const created = service.create({
      number: 'EST-005',
      customerName: 'To Delete',
      items: [{ description: 'A', quantity: 1, price: 10 }]
    });

    const deleted = service.delete(created.id);
    const all = service.getAll();

    expect(deleted).toBe(true);
    expect(all.length).toBe(0);
  });
});