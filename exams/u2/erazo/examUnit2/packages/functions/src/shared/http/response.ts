import type { APIGatewayProxyResultV2 } from "aws-lambda";
import { ZodError } from "zod";
import { ApplicationError } from "../errors/ApplicationError";

const defaultHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
};

export function jsonResponse(statusCode: number, body: unknown): APIGatewayProxyResultV2 {
  return {
    statusCode,
    headers: defaultHeaders,
    body: JSON.stringify(body)
  };
}

export function emptyResponse(statusCode: number): APIGatewayProxyResultV2 {
  return {
    statusCode,
    headers: defaultHeaders,
    body: ""
  };
}

export function errorResponse(error: unknown): APIGatewayProxyResultV2 {
  if (error instanceof ZodError) {
    return jsonResponse(400, {
      message: "Invalid request payload",
      issues: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message
      }))
    });
  }

  if (error instanceof ApplicationError) {
    return jsonResponse(error.statusCode, { message: error.message });
  }

  console.error(error);
  return jsonResponse(500, { message: "Internal server error" });
}
