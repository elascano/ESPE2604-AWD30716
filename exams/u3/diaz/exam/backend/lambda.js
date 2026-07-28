require("dotenv").config();

const serverless = require("serverless-http");
const app = require("./app");

// Entry point used by AWS Lambda (via API Gateway)
exports.handler = serverless(app);
