import cors from "cors";
import express, { type ErrorRequestHandler } from "express";
import helmet from "helmet";
import { runMigrations } from "./db/migrate";
import { env } from "./env";
import { authRouter } from "./routes/auth";
import { contentRouter } from "./routes/content";
import { iconsRouter } from "./routes/icons";
import { mediaRouter } from "./routes/media";
import { contactRouter, messagesRouter } from "./routes/messages";

const app = express();

// The Next.js server sits in front of the API on the same machine and forwards the visitor IP.
app.set("trust proxy", "loopback");
app.disable("x-powered-by");
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: env.corsOrigins }));
app.use(express.json({ limit: "2mb" }));

app.use(
  "/uploads",
  express.static(env.uploadDir, {
    fallthrough: false,
    immutable: true,
    maxAge: "365d",
    setHeaders: (res) => {
      res.setHeader("Content-Security-Policy", "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; sandbox");
      res.setHeader("X-Content-Type-Options", "nosniff");
    },
  }),
);

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRouter);
app.use("/api/content", contentRouter);
app.use("/api/contact", contactRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/media", mediaRouter);
app.use("/api/icons", iconsRouter);

app.use("/api", (_req, res) => res.status(404).json({ error: "Not found." }));

const onError: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error?.status === 404 || error?.statusCode === 404) return res.status(404).json({ error: "Not found." });
  if (error?.type === "entity.parse.failed") return res.status(400).json({ error: "Invalid JSON." });
  console.error(error);
  res.status(500).json({ error: "Something went wrong." });
};
app.use(onError);

await runMigrations();
app.listen(env.PORT, () => console.log(`API ready on http://localhost:${env.PORT}`));
