import express, { Application } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import taxpayerRoutes from './routes/taxpayer.routes';
import sriRoutes from './routes/sri.routes';
import workspaceRoutes from './routes/workspace.routes';
import invoiceRoutes from './routes/invoice.routes';
import atsRoutes from './routes/ats.routes';
import traceabilityRoutes from './routes/traceability.routes';
import dashboardRoutes from './routes/dashboard.routes';
import adminRoutes from './routes/admin.routes';
import supportRoutes from './routes/support.routes';
import { authMiddleware } from './middlewares/auth.middleware';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.configureMiddlewares();
    this.configureRoutes();
  }

  private configureMiddlewares(): void {
    this.app.use(cors());
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ limit: '50mb', extended: true }));
  }

  private configureRoutes(): void {
    this.app.use('/auth', authRoutes);
    this.app.use('/taxpayer', authMiddleware, taxpayerRoutes);
    this.app.use('/sri', authMiddleware, sriRoutes);
    this.app.use('/workspaces', authMiddleware, workspaceRoutes);
    this.app.use('/admin', authMiddleware, adminRoutes);
    this.app.use('/support', authMiddleware, supportRoutes);
    this.app.use('/invoices', authMiddleware, invoiceRoutes);
    this.app.use('/ats', authMiddleware, atsRoutes);
    this.app.use('/traceability', authMiddleware, traceabilityRoutes);
    this.app.use('/dashboard', authMiddleware, dashboardRoutes);
    
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({ status: 'OK', service: 'Business Rules Service', timestamp: new Date() });
    });
  }
}

export default new App().app;
