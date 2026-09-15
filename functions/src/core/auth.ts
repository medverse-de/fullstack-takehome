import type { Request } from "express";

export interface AuthContext {
  readonly uid: string;
  readonly tenantId: string;
  readonly role: "user" | "admin";
}

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

/**
 * Verifies the Firebase ID token on the request and returns the claims we care
 * about. Tenant and role are custom claims set when the user is provisioned.
 */
export async function requireAuth(req: Request): Promise<AuthContext> {
  const header = req.header("authorization");
  if (!header?.startsWith("Bearer ")) {
    throw new UnauthorizedError("Missing bearer token");
  }

  const { getAuth } = await import("firebase-admin/auth");
  const decoded = await getAuth().verifyIdToken(header.slice("Bearer ".length));

  if (typeof decoded.tenantId !== "string") {
    throw new UnauthorizedError("Token has no tenant");
  }

  return {
    uid: decoded.uid,
    tenantId: decoded.tenantId,
    role: decoded.role === "admin" ? "admin" : "user",
  };
}
