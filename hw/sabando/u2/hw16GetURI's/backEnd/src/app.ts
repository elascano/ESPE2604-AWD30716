import express, { Application } from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes';
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
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private configureRoutes(): void {
    this.app.use('/users', userRoutes);
    this.app.use('/taxpayer', taxpayerRoutes);
    this.app.use('/sri', sriRoutes);
    this.app.use('/workspaces', workspaceRoutes);
    this.app.use('/invoices', authMiddleware, invoiceRoutes);
    this.app.use('/ats', authMiddleware, atsRoutes);
    this.app.use('/traceability', authMiddleware, traceabilityRoutes);
    this.app.use('/dashboard', authMiddleware, dashboardRoutes);
    this.app.use('/admin', adminRoutes);
    this.app.use('/support', supportRoutes);
    
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({ status: 'OK', timestamp: new Date() });
    });
  }
}

export default new App().app;
