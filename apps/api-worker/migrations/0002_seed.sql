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
