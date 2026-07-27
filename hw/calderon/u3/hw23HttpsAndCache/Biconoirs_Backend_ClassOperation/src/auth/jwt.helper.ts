import * as crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "biconoirs-gourmet-class-operation-secret-key-123456";

export function signJwt(payload: any, expiresInSeconds: number = 3600): string {
  const header = { alg: "HS256", typ: "JWT" };
  const base64Header = Buffer.from(JSON.stringify(header)).toString("base64url");

  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const fullPayload = { ...payload, exp };
  const base64Payload = Buffer.from(JSON.stringify(fullPayload)).toString("base64url");

  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${base64Header}.${base64Payload}`)
    .digest("base64url");

  return `${base64Header}.${base64Payload}.${signature}`;
}

export function verifyJwt(token: string): any {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [header, payload, signature] = parts;

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${header}.${payload}`)
      .digest("base64url");

    if (signature !== expectedSignature) {
      return null;
    }

    // Decode payload
    const decodedPayload = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    );

    // Check expiration
    if (decodedPayload.exp && decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return decodedPayload;
  } catch (error) {
    return null;
  }
}

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export function comparePasswords(password: string, hash: string): boolean {
  if (!password || !hash) return false;
  // Fallback comparison for existing plain text passwords
  if (password === hash) return true;
  // Standard SHA-256 check
  return hashPassword(password) === hash;
}
