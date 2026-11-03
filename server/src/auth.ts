import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { db } from "./db";
import { admins } from "./db/schema";
import { env } from "./env";

const TOKEN_TTL = "7d";

export type AdminRequest = Request & { admin?: { id: number; email: string } };

export function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signToken(admin: { id: number; tokenVersion: number }) {
  return jwt.sign({ sub: String(admin.id), v: admin.tokenVersion }, env.JWT_SECRET, { expiresIn: TOKEN_TTL });
}

export async function requireAdmin(req: AdminRequest, res: Response, next: NextFunction) {
  const header = req.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return res.status(401).json({ error: "Sign in required." });

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string; v: number };
    const [admin] = await db.select().from(admins).where(eq(admins.id, Number(payload.sub)));
    if (!admin || admin.tokenVersion !== payload.v) return res.status(401).json({ error: "Session expired." });
    req.admin = { id: admin.id, email: admin.email };
    next();
  } catch {
    res.status(401).json({ error: "Session expired." });
  }
}
