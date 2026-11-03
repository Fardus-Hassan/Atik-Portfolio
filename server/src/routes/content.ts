import { Router } from "express";
import { requireAdmin } from "../auth";
import { getContent, getSection, isSectionKey, resetSection, saveSection } from "../content";

export const contentRouter = Router();

contentRouter.get("/", async (_req, res) => {
  res.set("Cache-Control", "no-store");
  res.json(await getContent());
});

contentRouter.get("/:key", requireAdmin, async (req, res) => {
  const key = String(req.params.key);
  if (!isSectionKey(key)) return res.status(404).json({ error: "Unknown section." });
  res.json(await getSection(key));
});

contentRouter.put("/:key", requireAdmin, async (req, res) => {
  const key = String(req.params.key);
  if (!isSectionKey(key)) return res.status(404).json({ error: "Unknown section." });
  const result = await saveSection(key, req.body?.data);
  if (!result.ok) return res.status(400).json({ error: "Some fields need attention.", issues: result.issues });
  res.json({ data: result.data });
});

contentRouter.delete("/:key", requireAdmin, async (req, res) => {
  const key = String(req.params.key);
  if (!isSectionKey(key)) return res.status(404).json({ error: "Unknown section." });
  res.json({ data: await resetSection(key) });
});
