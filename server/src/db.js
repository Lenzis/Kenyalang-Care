import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function loadEnv() {
  // Minimal .env loader (no extra dependency).
  // Supports lines like KEY=value (no quotes parsing).
  const envPath = path.resolve(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv();

export function getConfig() {
  const port = Number(process.env.PORT || "5174");
  const dbFile = process.env.DB_FILE || "./data/kenyalang-care.sqlite";
  const allowedOrigin = process.env.ALLOWED_ORIGIN || "http://localhost:5173";
  return { port, dbFile, allowedOrigin };
}

export function openDb() {
  const { dbFile } = getConfig();
  const absDbFile = path.resolve(process.cwd(), dbFile);
  ensureDir(path.dirname(absDbFile));

  const db = new Database(absDbFile);
  db.pragma("foreign_keys = ON");
  return db;
}

