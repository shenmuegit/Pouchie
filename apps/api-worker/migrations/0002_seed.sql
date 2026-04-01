-- Seed runs only in local development.
INSERT OR IGNORE INTO users (
  id, apple_sub, email, display_name, created_at, updated_at
) VALUES (
  'user_seed_1',
  'dev:seed@example.com',
  'seed@example.com',
  '测试账号',
  '2026-03-25T00:00:00.000Z',
  '2026-03-25T00:00:00.000Z'
);

INSERT OR IGNORE INTO user_preferences (
  user_id,
  face_id_enabled,
  default_currency,
  notifications_enabled,
  icloud_sync_status,
  export_status,
  created_at,
  updated_at
) VALUES (
  'user_seed_1',
  1,
  'CNY',
  1,
  '占位：未接入 iCloud，同步功能将在后续版本开放',
  '占位：导出功能将在后续版本开放',
  '2026-03-25T00:00:00.000Z',
  '2026-03-25T00:00:00.000Z'
);

