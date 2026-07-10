import serverlessExpress from "@codegenie/serverless-express";
import app from "./app";

const server = serverlessExpress({ app });

export const handler = (event: any, context: any) => {
  return server(event, context);
};