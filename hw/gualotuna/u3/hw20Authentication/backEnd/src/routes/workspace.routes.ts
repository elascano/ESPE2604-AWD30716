import { Router } from 'express';
import { WorkspaceController } from '../controllers/workspace.controller';

const router = Router();
const workspaceController = new WorkspaceController();

// Basic workspaces routing
router.get('/user/:userId', (req, res) => workspaceController.getWorkspaces(req, res));
router.get('/:workspaceId', (req, res) => workspaceController.getWorkspaceDetail(req, res));
router.post('/', (req, res) => workspaceController.createWorkspace(req, res));

// Sub-resources of workspace
router.get('/:workspaceId/invoices', (req, res) => workspaceController.getInvoices(req, res));
router.get('/:workspaceId/ats', (req, res) => workspaceController.getAtsFiles(req, res));
router.get('/:workspaceId/summary', (req, res) => workspaceController.getSummary(req, res));

// ProcessTracer routing
router.get('/:workspaceId/process-status', (req, res) => workspaceController.getProcessStatus(req, res));
router.get('/:workspaceId/process-steps', (req, res) => workspaceController.getProcessSteps(req, res));
router.get('/:workspaceId/invoices/export', (req, res) => workspaceController.exportInvoices(req, res));
router.post('/:workspaceId/invoices/download', (req, res) => workspaceController.downloadInvoicesAsync(req, res));
router.get('/:workspaceId/ats/download-xml', (req, res) => workspaceController.downloadAtsXml(req, res));
router.get('/:workspaceId/ats/download-xlsm', (req, res) => workspaceController.downloadAtsXlsm(req, res));
router.post('/:workspaceId/ats/generate', (req, res) => workspaceController.generateAtsAsync(req, res));
router.get('/:workspaceId/logs', (req, res) => workspaceController.getLogs(req, res));

// DELETE endpoint
router.delete('/:workspaceId', (req, res) => workspaceController.deleteWorkspace(req, res));

export default router;
