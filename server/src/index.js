import express from "express";
import cors from "cors";
import { openDb, getConfig } from "./db.js";
import fs from "node:fs";
import path from "node:path";

const { port, allowedOrigin } = getConfig();
const db = openDb();

// Ensure schema exists (safe to run every boot).
const schemaSql = fs.readFileSync(path.resolve(process.cwd(), "./src/schema.sql"), "utf8");
db.exec(schemaSql);

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: (origin, cb) => {
      // In dev, Vite may pick a different port if 5173/5174 are busy.
      // Allow any localhost port, plus the explicitly configured origin.
      if (!origin) return cb(null, true);
      if (origin === allowedOrigin) return cb(null, true);
      if (/^http:\/\/localhost:\d+$/.test(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked for origin: ${origin}`));
    },
  })
);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/services", (_req, res) => {
  const categories = db
    .prepare(
      `SELECT id, title_en, title_ms, icon_key
       FROM service_category
       ORDER BY sort_order ASC, id ASC`
    )
    .all();

  const items = db
    .prepare(
      `SELECT id, category_id, label
       FROM service_item
       ORDER BY category_id ASC, sort_order ASC, id ASC`
    )
    .all();

  const itemsByCategory = new Map();
  for (const it of items) {
    const arr = itemsByCategory.get(it.category_id) ?? [];
    arr.push(it.label);
    itemsByCategory.set(it.category_id, arr);
  }

  const payload = categories.map((c) => ({
    id: c.id,
    title: { en: c.title_en, ms: c.title_ms },
    iconKey: c.icon_key,
    items: itemsByCategory.get(c.id) ?? [],
  }));

  res.json(payload);
});

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
  console.log(`CORS allowed origin: ${allowedOrigin}`);
});

