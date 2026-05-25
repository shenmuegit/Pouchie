-- Add Google OAuth support
-- google_sub stores the Google user ID; NULL for Apple-only users

ALTER TABLE users ADD COLUMN google_sub TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google_sub
  ON users(google_sub)
  WHERE google_sub IS NOT NULL;
