-- Migration: init
-- UP
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch ())
);

CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX sessions_user_id_idx ON sessions (user_id);

-- DOWN
DROP INDEX IF EXISTS sessions_user_id_idx;

DROP TABLE IF EXISTS sessions;

DROP TABLE IF EXISTS users;
