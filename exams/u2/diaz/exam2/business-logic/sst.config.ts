/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "soundmixer-business-logic",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: {
          region: "us-east-1",
        },
      },
    };
  },
  async run() {
    // CRUD API URL must be set after deploying the CRUD stack
    // Format: https://<id>.execute-api.us-east-1.amazonaws.com/store
    const crudApiUrl = process.env.CRUD_API_URL ?? "";

    // API Gateway + Lambda for the Business Logic service
    const api = new sst.aws.ApiGatewayV2("BusinessLogicApi");

    api.route("POST /store", {
      handler: "src/handler.handler",
      environment: {
        // Full URL to the CRUD Lambda endpoint (POST /store)
        CRUD_API_URL: crudApiUrl,
      },
      memory: "256 MB",
      timeout: "30 seconds",
    });

    return {
      businessLogicApiUrl: api.url,
    };
  },
});
