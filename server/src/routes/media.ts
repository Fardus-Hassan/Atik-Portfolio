import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { desc, eq } from "drizzle-orm";
import { Router } from "express";
import multer from "multer";
import { z } from "zod";
import { requireAdmin } from "../auth";
import { db } from "../db";
import { media } from "../db/schema";
import { env } from "../env";

export const mediaRouter = Router();
mediaRouter.use(requireAdmin);

const allowed: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
  "application/pdf": ".pdf",
};

fs.mkdirSync(env.uploadDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: env.uploadDir,
    filename: (_req, file, done) => {
      const base = path
        .parse(file.originalname)
        .name.toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 40);
      done(null, `${Date.now()}-${crypto.randomBytes(4).toString("hex")}-${base || "file"}${allowed[file.mimetype]}`);
    },
  }),
  limits: { fileSize: 15 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, done) => done(null, file.mimetype in allowed),
});

mediaRouter.get("/", async (_req, res) => {
  res.json({ items: await db.select().from(media).orderBy(desc(media.createdAt)) });
});

mediaRouter.post("/", (req, res) => {
  upload.single("file")(req, res, async (error) => {
    if (error) {
      const tooBig = error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE";
      return res.status(400).json({ error: tooBig ? "The file is larger than 15 MB." : "Upload failed." });
    }
    if (!req.file) return res.status(400).json({ error: "Use a JPG, PNG, WebP, AVIF, GIF, SVG, or PDF file." });

    const [row] = await db
      .insert(media)
      .values({
        fileName: req.file.filename,
        originalName: req.file.originalname.slice(0, 200),
        mime: req.file.mimetype,
        size: req.file.size,
        url: `/uploads/${req.file.filename}`,
        alt: typeof req.body?.alt === "string" ? req.body.alt.slice(0, 300) : "",
      })
      .returning();
    res.status(201).json(row);
  });
});

mediaRouter.patch("/:id", async (req, res) => {
  const parsed = z.object({ alt: z.string().max(300) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid alt text." });
  const [row] = await db.update(media).set(parsed.data).where(eq(media.id, Number(req.params.id))).returning();
  if (!row) return res.status(404).json({ error: "File not found." });
  res.json(row);
});

mediaRouter.delete("/:id", async (req, res) => {
  const [row] = await db
    .delete(media)
    .where(eq(media.id, Number(req.params.id)))
    .returning();
  if (!row) return res.status(404).json({ error: "File not found." });
  await fs.promises.rm(path.join(env.uploadDir, row.fileName), { force: true });
  res.json({ ok: true });
});
