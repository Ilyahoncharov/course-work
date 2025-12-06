import { Router, Request, Response } from 'express';
import { EstimateService } from '../services/EstimateService';

export function createEstimateRouter(estimateService: EstimateService): Router {
  const router = Router();

  router.get('/', (req: Request, res: Response) => {
    const all = estimateService.getAll();
    res.json(all);
  });

  router.get('/:id', (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const estimate = estimateService.getById(id);

    if (!estimate) {
      return res.status(404).json({ message: 'Estimate not found' });
    }

    res.json(estimate);
  });

  router.post('/', (req: Request, res: Response) => {
    const { number, customerName, items } = req.body;

    if (!number || !customerName || !Array.isArray(items)) {
      return res.status(400).json({ message: 'Invalid estimate payload' });
    }

    try {
      const created = estimateService.create({ number, customerName, items });
      res.status(201).json(created);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  router.put('/:id', (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { number, customerName, items } = req.body;

    if (!number || !customerName || !Array.isArray(items)) {
      return res.status(400).json({ message: 'Invalid estimate payload' });
    }

    try {
      const updated = estimateService.update(id, { number, customerName, items });
      if (!updated) {
        return res.status(404).json({ message: 'Estimate not found' });
      }

      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  router.delete('/:id', (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const deleted = estimateService.delete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Estimate not found' });
    }

    res.status(204).send();
  });

  return router;
}