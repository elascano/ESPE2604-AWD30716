/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "chickens",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    // Creamos un API Gateway v2
    const api = new sst.aws.ApiGatewayV2("MiApi");

    // Enrutamos todo el tráfico ($default) a tu función Lambda
    api.route("$default", {
      handler: "apps/api/handler.handler",
    });

    // Exportamos la URL para poder verla en la terminal al terminar el despliegue
    return {
      ApiUrl: api.url,
    };
  },
});
