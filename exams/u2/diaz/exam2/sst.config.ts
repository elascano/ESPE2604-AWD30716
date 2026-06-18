export async function app(app: any) {
  const { Bucket } = await import("@serverless-stack/resources");

  app.stack(function StorageStack({ stack }: any) {
    new Bucket(stack, "StorageBucket", {
      removalPolicy: "destroy",
      cors: [{ allowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"], allowedOrigins: ["*"] }],
    });
  });
}

export default { app };
