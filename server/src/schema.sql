PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS service_category (
  id INTEGER PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_ms TEXT NOT NULL,
  icon_key TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS service_item (
  id INTEGER PRIMARY KEY,
  category_id INTEGER NOT NULL,
  label TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (category_id) REFERENCES service_category(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_service_item_category ON service_item(category_id);

