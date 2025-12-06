import express from 'express';
import { EstimateService } from './services/EstimateService';
import { InvoiceService } from './services/InvoiceService';
import { createEstimateRouter } from './routes/estimateRoutes';
import { createInvoiceRouter } from './routes/invoiceRoutes';

export function createApp() {
  const app = express();

  app.use(express.json());

  const estimateService = new EstimateService();
  const invoiceService = new InvoiceService(estimateService);

  app.use('/api/estimates', createEstimateRouter(estimateService));
  app.use('/api/invoices', createInvoiceRouter(invoiceService));

  return app;
}