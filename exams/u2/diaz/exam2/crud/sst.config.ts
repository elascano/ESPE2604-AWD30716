/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "soundmixer-crud",
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
    // API Gateway + Lambda for the CRUD service
    const api = new sst.aws.ApiGatewayV2("CrudApi");

    api.route("POST /store", {
      handler: "src/handler.handler",
      environment: {
        DATABASE_URL: process.env.DATABASE_URL ?? "",
      },
      nodejs: {
        format: "cjs",
        // Bundle these native modules properly for Lambda
        install: ["pg", "@prisma/client", "@prisma/adapter-pg"],
      },
      memory: "512 MB",
      timeout: "30 seconds",
    });

    return {
      crudApiUrl: api.url,
    };
  },
});