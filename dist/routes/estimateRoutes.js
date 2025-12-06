"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEstimateRouter = createEstimateRouter;
const express_1 = require("express");
function createEstimateRouter(estimateService) {
    const router = (0, express_1.Router)();
    router.get('/', (req, res) => {
        const all = estimateService.getAll();
        res.json(all);
    });
    router.get('/:id', (req, res) => {
        const id = Number(req.params.id);
        const estimate = estimateService.getById(id);
        if (!estimate) {
            return res.status(404).json({ message: 'Estimate not found' });
        }
        res.json(estimate);
    });
    router.post('/', (req, res) => {
        const { number, customerName, amount } = req.body;
        if (!number || !customerName || typeof amount !== 'number') {
            return res.status(400).json({ message: 'Invalid estimate data' });
        }
        const created = estimateService.create({ number, customerName, amount });
        res.status(201).json(created);
    });
    router.put('/:id', (req, res) => {
        const id = Number(req.params.id);
        const { number, customerName, amount } = req.body;
        if (!number || !customerName || typeof amount !== 'number') {
            return res.status(400).json({ message: 'Invalid estimate data' });
        }
        const updated = estimateService.update(id, { number, customerName, amount });
        if (!updated) {
            return res.status(404).json({ message: 'Estimate not found' });
        }
        res.status(204).send();
    });
    router.delete('/:id', (req, res) => {
        const id = Number(req.params.id);
        const deleted = estimateService.delete(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Estimate not found' });
        }
        res.status(204).send();
    });
    return router;
}
