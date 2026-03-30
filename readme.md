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
