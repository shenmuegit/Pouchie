# 小荷包 · App Store & Google Play 上架清单

> 版本：1.0.0 (build 1) · Bundle ID / Package: `com.meolord.xiaohebao`
> 更新日期：2026-05-25

---

## 一、代码 & 构建配置

- [x] `app.json` 已补全（icon / splash / buildNumber / usesAppleSignIn / NSFaceIDUsageDescription / android）
- [x] `eas.json` 已创建，iOS + Android production / preview profile 配置正确
- [ ] `eas.json` 里 `ascAppId` 和 `appleTeamId` 已填写（iOS）
- [x] 图标文件 `assets/icon.png` 已制作（**1024×1024px，无圆角，无透明通道**）
- [x] Android 自适应图标 `assets/adaptive-icon.png` 已制作（**1024×1024px，内容在 66% 安全区内**）
- [x] 启动屏 `assets/splash.png` 已制作（1284×2778px，背景色 `#EDF6FF`）
- [ ] `ENABLE_DEV_BYPASS` 在生产 Worker 中确认为 `"false"`
- [ ] `.env` 里 `EXPO_PUBLIC_API_BASE_URL` 指向生产 Worker 地址（非 localhost）
- [ ] 运行 `npm run typecheck` 全通过
- [ ] 运行 `npm run test` 全通过

---

## 二、后端部署（Cloudflare Workers）

- [x] 在 Cloudflare Dashboard 创建生产 D1 数据库 `xiaohebao-prod`（ID: `a62e57d0-c627-4435-a55a-2e9a6289fbd1`）
- [x] 数据库 ID 已填入 `wrangler.toml` 的 `[env.production]` 段
- [x] 执行生产迁移（`--remote`）：`0001_init.sql` ✅ `0002_seed.sql` ✅
- [x] 执行 Google 认证迁移：`wrangler d1 migrations apply xiaohebao-prod --env production --remote`（`0003_google_auth.sql`）✅
- [x] 部署 Worker：**`https://xiaohebao-api-production.shenmuegm.workers.dev`**
- [x] 重新部署（含 Google 登录路由）：`wrangler deploy --env production` ✅ (Version: 046cb1d1)
- [x] `/health` 返回 `{"ok":true}` ✅
- [x] 隐私政策页面 `https://xiaohebao-api-production.shenmuegm.workers.dev/privacy` ✅
- [x] 支持页面 `https://xiaohebao-api-production.shenmuegm.workers.dev/support` ✅
- [ ] 填写 `wrangler.toml` `[env.production.vars]` 中的 `GOOGLE_CLIENT_ID`（Google Cloud Console Web OAuth Client ID）

---

## 三、Google 开发者配置

### 3a. Google Cloud Console

- [ ] 创建 OAuth 2.0 **Web** Client ID（用于后端 JWT 校验）
  - 类型：Web application
  - 授权来源：无需额外配置（仅做 token 验证）
  - 将 `Client ID` 填入 `wrangler.toml` `GOOGLE_CLIENT_ID` 字段
- [ ] 创建 OAuth 2.0 **Android** Client ID
  - Package name：`com.meolord.xiaohebao`
  - SHA-1 指纹：执行 `eas credentials` 或 `keytool` 获取
  - 将 `Client ID` 填入 `apps/mobile/.env` 的 `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`
- [ ] 将 **Web** Client ID 同时填入 `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`（移动端 `useAuthRequest` 需要）

### 3b. Google Play Console

- [ ] 创建应用记录
  - 应用名称：小荷包
  - 默认语言：中文（简体）
  - 应用或游戏：**应用**
  - 免费或付费：**免费**
- [ ] 创建服务账号并下载密钥（`google-play-service-account.json`）
  - Google Play Console → 设置 → API 访问权限 → 创建服务账号
  - 赋予"发布版本"权限
  - 将 JSON 文件放置于 `apps/mobile/google-play-service-account.json`（已加入 `.gitignore`！）

---

## 四、Apple 开发者配置（iOS 专属）

- [ ] 在 [App Store Connect](https://appstoreconnect.apple.com) 创建 App 记录
  - 名称：小荷包
  - Bundle ID：`com.meolord.xiaohebao`
  - 主要语言：简体中文
  - 类别：**财务**（Finance）
- [ ] 在 [Apple Developer Portal](https://developer.apple.com) 配置：
  - Provisioning Profile（App Store Distribution）
  - Push Notifications capability（如启用通知）
  - Sign In with Apple capability
- [ ] `eas.json` 中填入 `appleTeamId`（10 位大写字母+数字）
- [ ] `eas.json` 中填入 `ascAppId`（App Store Connect App ID，纯数字）

---

## 五、EAS 构建 & 提交

```bash
# 1. 安装 EAS CLI
npm install -g eas-cli

# 2. 登录 Expo 账户
eas login

cd apps/mobile

# ── iOS ──────────────────────────────────────
# 3. 构建 iOS Production（.ipa）
eas build --platform ios --profile production

# 4. 提交到 App Store Connect
eas submit --platform ios --profile production

# ── Android ──────────────────────────────────
# 5. 构建 Android Production（.aab）
eas build --platform android --profile production

# 6. 提交到 Google Play（需已配置 google-play-service-account.json）
eas submit --platform android --profile production
```

---

## 六、Google Play 商店元数据（Android）

### 截图规格

| 规格 | 尺寸 | 备注 |
|------|------|------|
| 手机截图 | 最小边 320dp，最大边 3840dp | 至少 2 张，最多 8 张 |
| 功能图片（Feature Graphic） | 1024×500px | 必须 |

截图内容同 App Store（覆盖 5 个核心页面）。

### 商店详情

**应用名称**（50字以内）
```
小荷包 - 记账与预算
```

**简短说明**（80字以内）
```
轻量好用的个人记账 App，快速记录收支，清晰掌握每月财务状况。
```

**完整说明**（4000字以内）
```
小荷包是一款轻量、好用的个人记账 App，帮你快速记录每笔收支，清晰掌握每月财务状况。

【核心功能】
• 快速记账：支持完整表单与快速弹窗两种模式，10 秒完成一笔记录
• 收支统计：按日/周/月/年查看支出趋势，分类占比一目了然
• 预算管理：设置月总预算及分类预算，超支前及时提醒
• 账单明细：按日期分组，支持搜索、筛选，左滑可快速编辑或删除
• 分类管理：自定义支出/收入分类，颜色与图标随心搭配

【安全与隐私】
• 使用 Google 账号一键登录，无需注册
• 数据仅存储于你的账户，不与第三方共享
• 支持指纹 / 图案锁屏保护

简简单单记好账，荷包总是满满的。
```

**分类**：财务（Finance）

**隐私政策 URL**（必须）
```
https://xiaohebao-api-production.shenmuegm.workers.dev/privacy
```

### 内容分级

进入 Google Play Console → 内容分级 → 填写问卷：
- 暴力：无 · 性内容：无 · 语言：无
- 目标受众：18+（财务类 App 无需针对儿童）
- 预期评级：**Everyone**

### 数据安全声明

| 数据类型 | 收集 | 传输加密 | 用途 |
|---------|------|---------|------|
| 姓名 | 是（Google 账号可选） | 是 | 应用功能 |
| 电子邮件 | 是（Google 账号） | 是 | 账户管理 |
| 财务信息（收支记录） | 是 | 是 | 应用功能 |
| 身份标识符（Google Sub） | 是 | 是 | 账户认证 |

---

## 七、App Store Connect 元数据（iOS）

### 截图规格（必须提交至少一种尺寸）

| 规格 | 尺寸 | 备注 |
|------|------|------|
| 6.7" iPhone（iPhone 15 Pro Max） | 1290×2796px | **必须** |
| 6.1" iPhone（iPhone 15 Pro） | 1179×2556px | 推荐 |

截图需覆盖以下页面（建议 5 张）：
1. 首页财务概览
2. 记账页面（支出 + 分类选择）
3. 账单明细（含滑动操作）
4. 统计分析（柱状图）
5. 预算管理

### 文字内容

**App 名称**
```
小荷包 - 记账与预算
```

**副标题**（30字以内）
```
简洁记账，轻松管理每月收支
```

**关键词**（100字以内，逗号分隔）
```
记账,账单,预算,理财,支出,收入,财务,个人记账,小荷包,收支管理
```

**描述**（正文，4000字以内）
```
小荷包是一款轻量、好用的个人记账 App，帮你快速记录每笔收支，清晰掌握每月财务状况。

【核心功能】
• 快速记账：支持完整表单与快速弹窗两种模式，10 秒完成一笔记录
• 收支统计：按日/周/月/年查看支出趋势，分类占比一目了然
• 预算管理：设置月总预算及分类预算，超支前及时提醒
• 账单明细：按日期分组，支持搜索、筛选，左滑可快速编辑或删除
• 分类管理：自定义支出/收入分类，颜色与图标随心搭配

【安全与隐私】
• 支持 Face ID 保护，账户安全有保障
• 数据仅存储于你的账户，不与第三方共享
• 使用 Apple 账号登录，无需注册

简简单单记好账，荷包总是满满的。
```

**隐私政策 URL**（必须）
```
https://xiaohebao-api-production.shenmuegm.workers.dev/privacy
```

**支持网址**（必须）
```
https://xiaohebao-api-production.shenmuegm.workers.dev/support
```

---

## 八、年龄分级

**iOS（App Store Connect）**：所有问题均选**无**（None），最终评级 **4+**。

**Android（Google Play）**：填写内容分级问卷，预期评级 **Everyone**。

---

## 九、定价与销售范围

- [ ] 定价：**免费**（Free）
- [ ] iOS 销售范围：中国大陆（+ 其他目标市场按需勾选）
- [ ] Android 销售范围：同上

---

## 十、隐私数据收集声明

**iOS（App Store Connect "App 隐私"）**

| 数据类型 | 收集 | 用途 |
|---------|------|------|
| 姓名 | 是（Apple 登录可选提供） | App 功能 |
| 电子邮件 | 是（Apple 登录可选提供） | App 功能 |
| 财务信息（收支记录） | 是 | App 功能 |
| 身份标识符（Apple Sub） | 是 | 账户认证 |

以上数据均**关联到用户身份**，不用于**追踪**。

**Android（Google Play 数据安全）** — 见第六节表格。

---

## 十一、审核准备

- [ ] iOS：在 App Store Connect 提交备注（Review Notes）中说明用 Apple Sign In 登录步骤
- [ ] Android：在 Google Play 管理中心提供测试账号（或说明用 Google Sign In 登录步骤）
- [ ] 确认 App 在 iPhone 14 / 15 真机上运行无崩溃
- [ ] 确认 App 在 Android 真机上运行无崩溃
- [ ] 确认无硬编码 `localhost` 或 `dev-bypass` 路径残留
- [ ] 首次提交选择"当审核通过后自动发布"或手动发布均可

---

## 十二、发布后

- [ ] 监控 Crash 报告（App Store Connect → 崩溃 / Google Play → Android Vitals）
- [ ] 监控 Cloudflare Worker 请求日志
- [ ] 准备 1.0.1 Hotfix 分支
