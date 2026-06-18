function getRequiredEnvironment(name: string): string {
  const value = process.env[name];

  if (!value || value.trim().length === 0) {
    throw new Error(
      `Missing required environment variable ${name}. Create a valid .env file.`
    );
  }

  return value;
}

export default $config({
  app(input) {
    return {
      name: "examUnit2",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage ?? ""),
      home: "aws"
    };
  },
  async run() {
    const [{ CellphoneStack }, { BusinessStack }] = await Promise.all([
      import("./stacks/CellphoneStack"),
      import("./stacks/BusinessStack")
    ]);

    const sharedEnvironment = {
      MONGODB_URI: getRequiredEnvironment("MONGODB_URI"),
      MONGODB_DB_NAME: process.env.MONGODB_DB_NAME ?? "examUnit2"
    };

    const cellphoneStack = CellphoneStack({ sharedEnvironment });
    const businessStack = BusinessStack({ sharedEnvironment });

    return {
      CellphoneApiUrl: cellphoneStack.cellphoneApiUrl,
      BusinessApiUrl: businessStack.businessApiUrl
    };
  }
});
