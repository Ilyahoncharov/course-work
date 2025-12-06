import { Router, Request, Response } from 'express';
import { InvoiceService } from '../services/InvoiceService';

export function createInvoiceRouter(invoiceService: InvoiceService): Router {
  const router = Router();

  router.get('/', (req: Request, res: Response) => {
    const all = invoiceService.getAll();
    res.json(all);
  });

  router.get('/:id', (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const invoice = invoiceService.getById(id);

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json(invoice);
  });

  router.delete('/:id', (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const deleted = invoiceService.delete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.status(204).send();
  });

  router.post('/from-estimate/:estimateId', (req: Request, res: Response) => {
    const estimateId = Number(req.params.estimateId);

    try {
      const invoice = invoiceService.createFromEstimate(estimateId);
      res.status(201).json(invoice);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  return router;
}