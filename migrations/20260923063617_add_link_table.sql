-- Migration: add_link_table
-- UP
CREATE TABLE links (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX idx_links_user_id ON links (user_id);

-- DOWN
DROP INDEX IF EXISTS idx_links_user_id;

DROP TABLE IF EXISTS links;
