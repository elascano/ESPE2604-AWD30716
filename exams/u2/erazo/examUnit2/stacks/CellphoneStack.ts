interface CellphoneStackInput {
  sharedEnvironment: Record<string, string>;
}

export function CellphoneStack({ sharedEnvironment }: CellphoneStackInput) {
  const cellphoneApi = new sst.aws.ApiGatewayV2("CellphoneApi", {
    cors: {
      allowMethods: ["GET", "POST", "OPTIONS"],
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

  cellphoneApi.route("POST /api/cellphone", {
    ...functionDefaults,
    handler: "packages/functions/src/cellphone/createCellphone.handler"
  });

  cellphoneApi.route("GET /api/cellphone", {
    ...functionDefaults,
    handler: "packages/functions/src/cellphone/listCellphones.handler"
  });

  return {
    cellphoneApi,
    cellphoneApiUrl: cellphoneApi.url
  };
}
