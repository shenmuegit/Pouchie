# MVP 技术栈清单
## 一、整体架构

- **客户端**：React Native + Expo
- **后端**：NestJS + Fastify
- **数据库**：PostgreSQL
- **ORM**：Prisma
- **客户端数据请求**：TanStack Query
- **客户端本地状态**：Zustand
- **表单**：React Hook Form
- **Token 安全存储**：Expo Secure Store
- **后端鉴权模式**：Opaque Token（登录后生成随机字符串，存 Redis 或数据库）
- **后端鉴权实现**：NestJS Guard 或 `@nestjs/passport` + `passport-http-bearer`
- **接口文档**：Swagger / OpenAPI

---

## 二、客户端依赖

### 核心框架

- **expo**：React Native 的开发框架与工具链，负责项目初始化、原生能力集成和构建发布。
- **react**：客户端 UI 组件开发的核心库。
- **react-native**：用于构建 iOS/Android 原生应用的跨平台运行时与 UI 框架。

### 路由与页面结构

- **expo-router**：基于文件系统的路由方案，用来快速组织 App 页面导航。

### 数据请求与状态管理

- **@tanstack/react-query**：负责服务端数据请求、缓存、失效刷新和加载状态管理。
- **zustand**：负责轻量级客户端本地状态管理，例如登录态内存镜像和 UI 状态。

### 表单与本地安全存储

- **react-hook-form**：用于表单状态管理和表单校验封装。
- **expo-secure-store**：用于在设备上安全存储 token、凭证等敏感信息。

### 可选：第三方登录扩展

- **expo-apple-authentication**：用于接入 iOS 的 Apple 登录。
- **expo-auth-session**：用于接入 OAuth / OpenID Connect 等第三方登录流程。

---

## 三、后端依赖

### NestJS 核心

- **@nestjs/core**：NestJS 运行时核心，负责模块装配、依赖注入和应用启动。
- **@nestjs/common**：NestJS 公共能力包，提供装饰器、异常、管道、守卫等基础能力。
- **@nestjs/platform-fastify**：让 NestJS 运行在 Fastify 之上，以获得更轻量的 HTTP 服务能力。
- **@nestjs/config**：用于统一管理环境变量和应用配置。

### 参数校验与转换

- **class-validator**：用于 DTO 参数校验。
- **class-transformer**：用于请求参数和 DTO 对象之间的类型转换。

### 数据库与 ORM

- **@prisma/client**：Prisma 生成的数据库访问客户端，用来安全地读写 PostgreSQL。
- **prisma**：Prisma 的 CLI 工具，用于建模、迁移和生成客户端代码。

### 接口文档

- **@nestjs/swagger**：用于自动生成 OpenAPI/Swagger 接口文档，方便前后端联调。

---

## 四、Token 鉴权依赖

- **@nestjs/passport**：把 Passport 集成进 NestJS 的 Guard/Strategy 体系。
- **passport**：Node.js 认证中间件基础框架。
- **passport-http-bearer**：专门解析和处理 `Authorization: Bearer <token>` 的 Bearer Token 策略。
- **passport-local**：用于处理用户名密码登录。
- **bcrypt**：用于密码哈希和密码比对。

---

## 五、数据库与缓存建议

- **PostgreSQL**：存储用户、业务数据，以及可选的长期 token/session 记录。

---

## 六、本仓库当前实现（2026-04-01）

本仓库已按“小荷包 MVP”落地为：

- **客户端**：Expo + React Native（iOS 优先）
- **后端**：Cloudflare Workers + Hono
- **数据库**：Cloudflare D1（SQLite）
- **业务抽象**：`Repository + Entry`，业务代码不依赖 Worker/D1
- **共享契约**：`packages/contracts`（Zod + TS 类型）
- **设计令牌**：`packages/ui-tokens`（Liquid Glass 视觉参数）

目录结构：

- `apps/mobile`：9 页面移动端（欢迎、登录、首页、账单、记账、统计、预算、分类、我的）
- `apps/api-worker`：D1 仓储实现 + Hono API 路由
- `packages/domain`：业务用例、仓储接口、Entry 抽象层
- `packages/contracts`：前后端共享 DTO/Schema
- `packages/ui-tokens`：玻璃材质视觉令牌

---

## 七、启动与测试

### 1. 安装依赖

```bash
npm install
```

### 2. 本地启动 API（Worker）

先在 `apps/api-worker/wrangler.toml` 填写 D1 `database_id`，然后：

```bash
npm run dev:api
```

### 3. 本地启动客户端（Expo iOS）

```bash
npm run dev:mobile
```

### 4. 运行测试与类型检查

```bash
npm run test
npm run typecheck
```

---

## 八、D1 迁移与种子

```bash
# 首次创建数据库后
npx wrangler d1 migrations apply xiaohebao-dev --local
npx wrangler d1 execute xiaohebao-dev --local --file=./apps/api-worker/migrations/0002_seed.sql
```

---

## 九、迁移到 NestJS + Fastify + PostgreSQL 的路径

当前业务层在 `packages/domain`，未来迁移只需：

1. 新增 PostgreSQL 仓储实现（替换 `apps/api-worker/src/repositories` 的 D1 实现）。
2. 新增 NestJS/Fastify 协议适配层（替换 Hono 路由层）。
3. `Entry` 和业务 UseCase 可保持不变，移动端与 contracts 也可复用。
