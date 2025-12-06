"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstimateService = void 0;
class EstimateService {
    constructor() {
        this.estimates = [];
        this.nextId = 1;
    }
    getAll() {
        return this.estimates;
    }
    getById(id) {
        return this.estimates.find(e => e.id === id);
    }
    create(data) {
        const estimate = {
            id: this.nextId++,
            createdAt: new Date(),
            ...data
        };
        this.estimates.push(estimate);
        return estimate;
    }
    update(id, data) {
        const existing = this.getById(id);
        if (!existing) {
            return false;
        }
        existing.number = data.number;
        existing.customerName = data.customerName;
        existing.amount = data.amount;
        // createdAt не змінюємо
        return true;
    }
    delete(id) {
        const index = this.estimates.findIndex(e => e.id === id);
        if (index === -1) {
            return false;
        }
        this.estimates.splice(index, 1);
        return true;
    }
}
exports.EstimateService = EstimateService;
