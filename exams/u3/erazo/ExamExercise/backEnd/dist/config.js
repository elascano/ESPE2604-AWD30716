"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const Config = {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    isDevelopment: process.env.NODE_ENV === 'development',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/computation-app',
};
exports.default = Config;
//# sourceMappingURL=config.js.map