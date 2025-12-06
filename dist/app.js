"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const EstimateService_1 = require("./services/EstimateService");
const InvoiceService_1 = require("./services/InvoiceService");
const estimateRoutes_1 = require("./routes/estimateRoutes");
const invoiceRoutes_1 = require("./routes/invoiceRoutes");
function createApp() {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    const estimateService = new EstimateService_1.EstimateService();
    const invoiceService = new InvoiceService_1.InvoiceService(estimateService);
    app.use('/api/estimates', (0, estimateRoutes_1.createEstimateRouter)(estimateService));
    app.use('/api/invoices', (0, invoiceRoutes_1.createInvoiceRouter)(invoiceService));
    return app;
}
