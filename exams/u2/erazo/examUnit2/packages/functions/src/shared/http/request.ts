import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { UnauthorizedError, ValidationError } from "../errors/ApplicationError";

export function parseJsonBody<T>(event: APIGatewayProxyEventV2): T {
  if (!event.body) {
    throw new ValidationError("Request body is required");
  }

  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body, "base64").toString("utf8")
    : event.body;

  try {
    return JSON.parse(rawBody) as T;
  } catch {
    throw new ValidationError("Request body must be valid JSON");
  }
}

export function getAuthorizationHeader(event: APIGatewayProxyEventV2): string {
  const header =
    event.headers.authorization ??
    event.headers.Authorization ??
    event.headers.AUTHORIZATION;

  if (!header) {
    throw new UnauthorizedError("Authorization header is required");
  }

  return header;
}

export function getBearerToken(event: APIGatewayProxyEventV2): string {
  const header = getAuthorizationHeader(event);
  const [scheme, token] = header.split(" ");

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    throw new UnauthorizedError("Authorization header must use Bearer token");
  }

  return token;
}

export function getPathParameter(event: APIGatewayProxyEventV2, name: string): string {
  const value = event.pathParameters?.[name];

  if (!value) {
    throw new ValidationError(`Path parameter ${name} is required`);
  }

  return value;
}
