import { Router } from "express";
import * as lucide from "lucide-static";
import * as simpleIcons from "simple-icons";
import { requireAdmin } from "../auth";

type IconResult = { name: string; source: "brands" | "lucide"; viewBox: string; body: string; mode: "fill" | "stroke" };

const brands: IconResult[] = Object.values(simpleIcons)
  .filter((icon) => typeof icon?.path === "string")
  .map((icon) => ({
    name: icon.title,
    source: "brands",
    viewBox: "0 0 24 24",
    body: `<path d="${icon.path}"/>`,
    mode: "fill",
  }));

const outline: IconResult[] = Object.entries(lucide)
  .filter((entry): entry is [string, string] => typeof entry[1] === "string" && entry[1].includes("<svg"))
  .map(([name, svg]) => ({
    name: name.replace(/([a-z0-9])([A-Z])/g, "$1 $2"),
    source: "lucide",
    viewBox: "0 0 24 24",
    body: svg
      .slice(svg.indexOf(">", svg.indexOf("<svg")) + 1, svg.lastIndexOf("</svg>"))
      .replace(/\s+/g, " ")
      .trim(),
    mode: "stroke",
  }));

export const iconsRouter = Router();
iconsRouter.use(requireAdmin);

iconsRouter.get("/", (req, res) => {
  const q = String(req.query.q ?? "")
    .trim()
    .toLowerCase();
  const source = req.query.source === "lucide" ? outline : brands;
  const matches = q
    ? source
        .filter((icon) => icon.name.toLowerCase().includes(q))
        .sort((a, b) => Number(!a.name.toLowerCase().startsWith(q)) - Number(!b.name.toLowerCase().startsWith(q)))
    : source;
  res.json({ items: matches.slice(0, 60), total: matches.length });
});
