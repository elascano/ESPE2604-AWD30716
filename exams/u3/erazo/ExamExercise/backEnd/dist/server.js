"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("./config"));
const database_1 = require("./database");
const computationRoutes_1 = __importDefault(require("./routes/computationRoutes"));
function createApp() {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({ origin: config_1.default.corsOrigin, credentials: true }));
    app.use(express_1.default.json());
    return app;
}
function registerRoutes(app) {
    app.get('/api/health', (req, res) => {
        res.json({ status: 'ok', service: 'Backend API with MongoDB', timestamp: new Date().toISOString() });
    });
    app.use('/api', computationRoutes_1.default);
}
async function start() {
    await (0, database_1.connect)();
    const app = createApp();
    registerRoutes(app);
    app.listen(config_1.default.port, () => {
        console.log(`[Backend] HTTP server running on port ${config_1.default.port}`);
    });
}
start();
//# sourceMappingURL=server.js.map