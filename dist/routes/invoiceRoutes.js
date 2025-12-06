"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInvoiceRouter = createInvoiceRouter;
const express_1 = require("express");
function createInvoiceRouter(invoiceService) {
    const router = (0, express_1.Router)();
    router.get('/', (req, res) => {
        const all = invoiceService.getAll();
        res.json(all);
    });
    router.get('/:id', (req, res) => {
        const id = Number(req.params.id);
        const invoice = invoiceService.getById(id);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.json(invoice);
    });
    router.post('/', (req, res) => {
        const { number, customerName, amount, estimateId } = req.body;
        if (!number || !customerName || typeof amount !== 'number' || typeof estimateId !== 'number') {
            return res.status(400).json({ message: 'Invalid invoice data' });
        }
        const created = invoiceService.create({ number, customerName, amount, estimateId });
        res.status(201).json(created);
    });
    router.delete('/:id', (req, res) => {
        const id = Number(req.params.id);
        const deleted = invoiceService.delete(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.status(204).send();
    });
    router.post('/from-estimate/:estimateId', (req, res) => {
        const estimateId = Number(req.params.estimateId);
        try {
            const invoice = invoiceService.createFromEstimate(estimateId);
            res.status(201).json(invoice);
        }
        catch (error) {
            res.status(404).json({ message: error.message });
        }
    });
    return router;
}
