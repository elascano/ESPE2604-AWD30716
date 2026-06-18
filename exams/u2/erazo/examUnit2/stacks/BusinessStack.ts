interface BusinessStackInput {
  sharedEnvironment: Record<string, string>;
}

export function BusinessStack({ sharedEnvironment }: BusinessStackInput) {
  const businessApi = new sst.aws.ApiGatewayV2("BusinessApi", {
    cors: {
      allowMethods: ["GET", "OPTIONS"],
      allowOrigins: ["*"],
      allowHeaders: ["Content-Type"]
    }
  });

  const functionDefaults = {
    runtime: "nodejs22.x" as const,
    timeout: "15 seconds",
    memory: "512 MB",
    environment: sharedEnvironment
  };

  businessApi.route("GET /api/cellphone/priceSortedAscendent", {
    ...functionDefaults,
    handler: "packages/functions/src/business/sortByPrice.handler"
  });

  businessApi.route("GET /api/cellphone/priceSortedDescendent", {
    ...functionDefaults,
    handler: "packages/functions/src/business/sortByPriceDesc.handler"
  });

  businessApi.route("GET /api/cellphone/count", {
    ...functionDefaults,
    handler: "packages/functions/src/business/countCellphones.handler"
  });

  return {
    businessApi,
    businessApiUrl: businessApi.url
  };
}
