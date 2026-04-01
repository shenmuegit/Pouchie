# 小荷包项目总文档（开发 / 测试 / 部署）

## 1. 项目概览

小荷包当前是一个 monorepo：

- 客户端：Expo + React Native（iOS 优先）
- 服务端：Cloudflare Workers + Hono
- 数据库：Cloudflare D1（SQLite）
- 架构：`Repository + Entry`，业务逻辑在 `packages/domain`，基础设施在 `apps/*`

---

## 2. 目录与包职责

### 根目录

- [package.json](/e:/code/meolord/Pouchie/package.json)：workspace 管理、统一脚本入口
- [tsconfig.base.json](/e:/code/meolord/Pouchie/tsconfig.base.json)：共享 TypeScript 配置与路径别名
- [readme.md](/e:/code/meolord/Pouchie/readme.md)：MVP 技术栈与项目说明
- [DEPLOY.md](/e:/code/meolord/Pouchie/DEPLOY.md)：部署说明（简版）
- [TESTING.md](/e:/code/meolord/Pouchie/TESTING.md)：测试说明（简版）

### apps/api-worker

- [apps/api-worker/src/index.ts](/e:/code/meolord/Pouchie/apps/api-worker/src/index.ts)：Worker 入口
- [apps/api-worker/src/create-app.ts](/e:/code/meolord/Pouchie/apps/api-worker/src/create-app.ts)：Hono 路由层（HTTP 协议适配）
- [apps/api-worker/src/repositories/d1-repositories.ts](/e:/code/meolord/Pouchie/apps/api-worker/src/repositories/d1-repositories.ts)：D1 仓储实现（基础设施层）
- [apps/api-worker/src/auth-provider.ts](/e:/code/meolord/Pouchie/apps/api-worker/src/auth-provider.ts)：Apple Token 校验与 Opaque Token 签发
- [apps/api-worker/migrations/0001_init.sql](/e:/code/meolord/Pouchie/apps/api-worker/migrations/0001_init.sql)：数据库建表
- [apps/api-worker/migrations/0002_seed.sql](/e:/code/meolord/Pouchie/apps/api-worker/migrations/0002_seed.sql)：本地种子数据
- [apps/api-worker/wrangler.toml](/e:/code/meolord/Pouchie/apps/api-worker/wrangler.toml)：Cloudflare Worker 与 D1 配置

### apps/mobile

- [apps/mobile/app](/e:/code/meolord/Pouchie/apps/mobile/app)：Expo Router 页面（欢迎、登录、首页、账单、记账、统计、预算、分类、我的）
- [apps/mobile/src/components](/e:/code/meolord/Pouchie/apps/mobile/src/components)：Liquid Glass UI 组件
- [apps/mobile/src/lib/http.ts](/e:/code/meolord/Pouchie/apps/mobile/src/lib/http.ts)：客户端 API 请求封装
- [apps/mobile/src/store/auth-store.ts](/e:/code/meolord/Pouchie/apps/mobile/src/store/auth-store.ts)：会话状态与 SecureStore token 持久化
- [apps/mobile/app.json](/e:/code/meolord/Pouchie/apps/mobile/app.json)：Expo 应用配置（iOS bundle id 等）

### packages/contracts

- [packages/contracts/src/index.ts](/e:/code/meolord/Pouchie/packages/contracts/src/index.ts)：前后端共享 DTO、Zod Schema、类型定义

### packages/domain

- [packages/domain/src/ports/repositories.ts](/e:/code/meolord/Pouchie/packages/domain/src/ports/repositories.ts)：仓储接口抽象
- [packages/domain/src/ports/entries.ts](/e:/code/meolord/Pouchie/packages/domain/src/ports/entries.ts)：业务入口接口抽象
- [packages/domain/src/create-app-entries.ts](/e:/code/meolord/Pouchie/packages/domain/src/create-app-entries.ts)：核心业务规则（用例）
- [packages/domain/tests/domain.spec.ts](/e:/code/meolord/Pouchie/packages/domain/tests/domain.spec.ts)：领域层单测

### packages/ui-tokens

- [packages/ui-tokens/src/index.ts](/e:/code/meolord/Pouchie/packages/ui-tokens/src/index.ts)：Liquid Glass 设计令牌（圆角、透明度、阴影、配色、动效）

---

## 3. 依赖库作用说明

### 服务端（apps/api-worker）

- `hono`：Worker 路由框架
- `@hono/zod-validator`：接口参数与 schema 校验桥接
- `jose`：Apple ID Token 验签
- `wrangler`：Cloudflare Worker / D1 本地与部署工具
- `@cloudflare/workers-types`：Worker 运行时类型
- `vitest`：服务端单测与路由测试

### 客户端（apps/mobile）

- `expo` / `react-native` / `react`：移动端运行时基础
- `expo-router`：文件路由
- `@tanstack/react-query`：服务端状态请求、缓存、失效刷新
- `zustand`：本地状态管理（会话与 UI 状态）
- `expo-secure-store`：token 安全存储
- `react-hook-form` + `zod` + `@hookform/resolvers`：表单与校验
- `expo-apple-authentication`：Apple 登录客户端能力
- `expo-blur` + `expo-linear-gradient` + `expo-haptics`：Liquid Glass 视觉与触感
- `lucide-react-native`：图标
- `vitest`：客户端工具与逻辑单测

### 共享包

- `packages/contracts` 的 `zod`：统一协议约束
- `packages/domain`：纯业务层（不依赖具体 HTTP 或数据库实现）

---

## 4. 本地开发与联调

### 前置条件

- Node.js 20+（建议 LTS）
- npm 10+
- Cloudflare 账号（Worker + D1）
- iOS 开发环境（Xcode + iOS Simulator）

### 安装依赖

```bash
npm install
```

### API 环境配置

1. 登录 Cloudflare

```bash
npx wrangler login
```

2. 创建本地开发 D1（首次）

```bash
npx wrangler d1 create xiaohebao-dev
```

3. 修改 [apps/api-worker/wrangler.toml](/e:/code/meolord/Pouchie/apps/api-worker/wrangler.toml)：

- 将 `database_id = "replace-me"` 替换为真实 `database_id`

4. 复制环境变量模板（可选）

```bash
copy apps\\api-worker\\.dev.vars.example apps\\api-worker\\.dev.vars
```

5. 执行迁移与 seed

```bash
npm run db:migrate:local --workspace @xiaohebao/api-worker
npm run db:seed:local --workspace @xiaohebao/api-worker
```

### 客户端环境配置

1. 复制模板：

```bash
copy apps\\mobile\\.env.example apps\\mobile\\.env
```

2. 设置：

- `EXPO_PUBLIC_API_BASE_URL=http://127.0.0.1:8787`

### 启动开发

1. 启动 API：

```bash
npm run dev:api
```

2. 启动客户端（iOS）：

```bash
npm run dev:mobile
```

---

## 5. 测试如何执行

### 全量执行

```bash
npm run typecheck
npm run test
```

### 分包执行

```bash
npm run typecheck --workspace @xiaohebao/api-worker
npm run test --workspace @xiaohebao/api-worker

npm run typecheck --workspace @xiaohebao/mobile
npm run test --workspace @xiaohebao/mobile

npm run typecheck --workspace @xiaohebao/domain
npm run test --workspace @xiaohebao/domain
```

### 客户端手工验收建议

1. 登录页：真 Apple 登录优先，失败回落开发测试账号。
2. 记账页：完整模式 + 快速弹窗模式都能创建账单。
3. 账单页：搜索、筛选、左滑编辑、左滑删除。
4. 预算页：月预算设置与分类预算编辑均可保存。
5. 分类页：新增分类、编辑名称/图标/颜色、删除/隐藏逻辑。
6. 我的页：偏好开关可保存并刷新。

---

## 6. 服务端部署（Cloudflare Worker + D1）

### 生产准备

1. 创建生产 D1：

```bash
npx wrangler d1 create xiaohebao-prod
```

2. 在 `wrangler.toml` 增加/替换生产数据库配置（`database_id` 为 prod）。
3. 关闭开发旁路：`ENABLE_DEV_BYPASS=false`
4. 设置生产 secrets：

```bash
npx wrangler secret put APPLE_AUDIENCE
npx wrangler secret put APPLE_ISSUER
```

### 执行部署

1. 执行生产迁移：

```bash
npx wrangler d1 migrations apply xiaohebao-prod
```

2. 发布 Worker：

```bash
npm run deploy --workspace @xiaohebao/api-worker
```

---

## 7. 客户端测试与部署（Expo iOS）

### 客户端测试

1. 逻辑测试：

```bash
npm run test --workspace @xiaohebao/mobile
```

2. 本地真机/模拟器联调：

```bash
npm run dev:mobile
```

### 客户端部署（推荐 EAS）

1. 安装 EAS CLI：

```bash
npm i -g eas-cli
```

2. 登录：

```bash
eas login
```

3. 在 EAS 环境设置 `EXPO_PUBLIC_API_BASE_URL` 指向生产 Worker URL。
4. 构建 iOS 安装包：

```bash
eas build -p ios --profile production
```

5. 提交 App Store（可选）：

```bash
eas submit -p ios --latest
```

> 说明：当前仓库未内置 `eas.json`，首次使用 `eas build` 会引导你初始化。

---

## 8. 迁移到 NestJS + Fastify + PostgreSQL 的方式

由于业务逻辑已在 `packages/domain`，迁移时只需替换两层：

1. 协议层：将 `apps/api-worker/src/create-app.ts`（Hono）替换为 NestJS 控制器/模块。
2. 仓储层：将 `apps/api-worker/src/repositories/d1-repositories.ts` 替换为 PostgreSQL 实现。

客户端与 `packages/contracts`、`packages/domain` 可继续复用，业务规则无需重写。

