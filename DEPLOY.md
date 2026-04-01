# 小荷包部署说明

## 1. Cloudflare 准备

```bash
npx wrangler login
npx wrangler d1 create xiaohebao-prod
```

把返回的 `database_id` 写入 [apps/api-worker/wrangler.toml](/e:/code/meolord/Pouchie/apps/api-worker/wrangler.toml) 的生产配置。

## 2. 应用数据库迁移

```bash
npx wrangler d1 migrations apply xiaohebao-prod
```

## 3. 配置环境变量

建议配置：

- `ENABLE_DEV_BYPASS=false`
- `SESSION_TTL_HOURS=720`
- `APPLE_AUDIENCE=<你的 Apple Service/Bundle ID>`
- `APPLE_ISSUER=https://appleid.apple.com`

```bash
npx wrangler secret put APPLE_AUDIENCE
npx wrangler secret put APPLE_ISSUER
```

## 4. 发布 Worker API

```bash
npm run deploy --workspace @xiaohebao/api-worker
```

## 5. 客户端发布前变量

在 Expo 构建环境里设置：

- `EXPO_PUBLIC_API_BASE_URL=http://127.0.0.1:8787`

