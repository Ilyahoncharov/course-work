"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceService = void 0;
class InvoiceService {
    constructor(estimateService) {
        this.invoices = [];
        this.nextId = 1;
        this.estimateService = estimateService;
    }
    getAll() {
        return this.invoices;
    }
    getById(id) {
        return this.invoices.find(i => i.id === id);
    }
    create(data) {
        const invoice = {
            id: this.nextId++,
            createdAt: new Date(),
            ...data
        };
        this.invoices.push(invoice);
        return invoice;
    }
    delete(id) {
        const index = this.invoices.findIndex(i => i.id === id);
        if (index === -1) {
            return false;
        }
        this.invoices.splice(index, 1);
        return true;
    }
    createFromEstimate(estimateId) {
        const estimate = this.estimateService.getById(estimateId);
        if (!estimate) {
            throw new Error(`Estimate with id ${estimateId} not found`);
        }
        const invoice = {
            id: this.nextId++,
            createdAt: new Date(),
            number: `INV-${estimate.number}`,
            customerName: estimate.customerName,
            amount: estimate.amount,
            estimateId: estimate.id
        };
        this.invoices.push(invoice);
        return invoice;
    }
}
exports.InvoiceService = InvoiceService;
