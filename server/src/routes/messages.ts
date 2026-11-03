import { and, count, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { requireAdmin } from "../auth";
import { db } from "../db";
import { messages, messageStatuses } from "../db/schema";

export const contactRouter = Router();
export const messagesRouter = Router();

const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many messages. Try again in a few minutes." },
});

const ContactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).default(""),
  company: z.string().trim().max(160).default(""),
  message: z.string().trim().min(1).max(5000),
  website: z.string().max(0).optional(),
});

contactRouter.post("/", contactLimiter, async (req, res) => {
  if (typeof req.body?.website === "string" && req.body.website.length > 0) {
    return res.status(201).json({ ok: true });
  }
  const parsed = ContactSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Some fields need attention.", fields: z.flattenError(parsed.error).fieldErrors });
  }
  const { website: _honeypot, ...data } = parsed.data;
  const [row] = await db
    .insert(messages)
    .values({ ...data, ip: req.ip ?? "", userAgent: (req.get("user-agent") ?? "").slice(0, 300) })
    .returning({ id: messages.id });
  res.status(201).json({ ok: true, id: row.id });
});

messagesRouter.use(requireAdmin);

const ListSchema = z.object({
  status: z.enum(messageStatuses).optional(),
  q: z.string().trim().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

messagesRouter.get("/", async (req, res) => {
  const parsed = ListSchema.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: "Invalid filter." });
  const { status, q, page, pageSize } = parsed.data;

  const filters: SQL[] = [];
  if (status) filters.push(eq(messages.status, status));
  if (q) {
    const term = `%${q.replace(/[%_\\]/g, "\\$&")}%`;
    filters.push(
      or(
        ilike(messages.name, term),
        ilike(messages.email, term),
        ilike(messages.company, term),
        ilike(messages.message, term),
      )!,
    );
  }
  const where = filters.length ? and(...filters) : undefined;

  const [rows, [{ total }]] = await Promise.all([
    db
      .select()
      .from(messages)
      .where(where)
      .orderBy(desc(messages.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db.select({ total: count() }).from(messages).where(where),
  ]);

  res.json({ items: rows, total, page, pageSize });
});

messagesRouter.get("/stats", async (_req, res) => {
  const rows = await db.select({ status: messages.status, total: count() }).from(messages).groupBy(messages.status);
  const byStatus = Object.fromEntries(messageStatuses.map((status) => [status, 0])) as Record<string, number>;
  for (const row of rows) byStatus[row.status] = row.total;
  const recent = await db.select().from(messages).orderBy(desc(messages.createdAt)).limit(5);
  res.json({ byStatus, total: Object.values(byStatus).reduce((sum, value) => sum + value, 0), recent });
});

messagesRouter.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const [row] = await db.select().from(messages).where(eq(messages.id, id));
  if (!row) return res.status(404).json({ error: "Message not found." });
  res.json(row);
});

const UpdateSchema = z.object({
  status: z.enum(messageStatuses).optional(),
  note: z.string().max(5000).optional(),
});

messagesRouter.patch("/:id", async (req, res) => {
  const parsed = UpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid update." });
  const [row] = await db
    .update(messages)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(messages.id, Number(req.params.id)))
    .returning();
  if (!row) return res.status(404).json({ error: "Message not found." });
  res.json(row);
});

messagesRouter.delete("/:id", async (req, res) => {
  const [row] = await db
    .delete(messages)
    .where(eq(messages.id, Number(req.params.id)))
    .returning({ id: messages.id });
  if (!row) return res.status(404).json({ error: "Message not found." });
  res.json({ ok: true });
});
