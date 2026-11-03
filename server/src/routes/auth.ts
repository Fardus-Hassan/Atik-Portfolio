import { eq, sql } from "drizzle-orm";
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { hashPassword, requireAdmin, signToken, verifyPassword, type AdminRequest } from "../auth";
import { db } from "../db";
import { admins } from "../db/schema";

export const authRouter = Router();

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false });

const LoginSchema = z.object({ email: z.string().trim().toLowerCase().email(), password: z.string().min(1) });

authRouter.post("/login", loginLimiter, async (req, res) => {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Enter your email and password." });

  const [admin] = await db.select().from(admins).where(eq(admins.email, parsed.data.email));
  const valid = admin ? await verifyPassword(parsed.data.password, admin.passwordHash) : false;
  if (!admin || !valid) return res.status(401).json({ error: "Email or password is wrong." });

  res.json({ token: signToken(admin), admin: { id: admin.id, email: admin.email } });
});

authRouter.get("/me", requireAdmin, (req: AdminRequest, res) => {
  res.json({ admin: req.admin });
});

const PasswordSchema = z.object({
  current: z.string().min(1),
  next: z.string().min(8, "Use at least 8 characters."),
});

authRouter.post("/password", requireAdmin, async (req: AdminRequest, res) => {
  const parsed = PasswordSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid password." });

  const [admin] = await db.select().from(admins).where(eq(admins.id, req.admin!.id));
  if (!admin || !(await verifyPassword(parsed.data.current, admin.passwordHash))) {
    return res.status(400).json({ error: "The current password is wrong." });
  }

  const [updated] = await db
    .update(admins)
    .set({
      passwordHash: await hashPassword(parsed.data.next),
      tokenVersion: sql`${admins.tokenVersion} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(admins.id, admin.id))
    .returning();

  res.json({ token: signToken(updated), admin: { id: updated.id, email: updated.email } });
});
