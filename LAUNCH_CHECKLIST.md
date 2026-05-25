# 小荷包 · App Store 上架清单

> 版本：1.0.0 (build 1) · Bundle ID: `com.meolord.xiaohebao`
> 更新日期：2026-05-25

---

## 一、代码 & 构建配置

- [ ] `app.json` 已补全（icon / splash / buildNumber / usesAppleSignIn / NSFaceIDUsageDescription）
- [ ] `eas.json` 已创建，production profile 配置正确
- [ ] `eas.json` 里 `ascAppId` 和 `appleTeamId` 已填写
- [ ] 图标文件 `assets/icon.png` 已制作（**1024×1024px，无圆角，无透明通道**）
- [ ] 启动屏 `assets/splash.png` 已制作（建议 1284×2778px，背景色 `#EDF6FF`）
- [ ] `ENABLE_DEV_BYPASS` 在生产 Worker 中确认为 `"false"`
- [ ] `.env` 里 `API_URL` 指向生产 Worker 地址（非 localhost）
- [ ] 运行 `npm run typecheck` 全通过
- [ ] 运行 `npm run test` 全通过

---

## 二、后端部署（Cloudflare Workers）

- [ ] 在 Cloudflare Dashboard 创建生产 D1 数据库，命名 `xiaohebao-prod`
- [ ] 将数据库 ID 填入 `wrangler.toml` 的 `[env.production]` 段
- [ ] 执行生产迁移：
  ```bash
  npx wrangler d1 migrations apply xiaohebao-prod --env production
  ```
- [ ] 部署 Worker：
  ```bash
  npx wrangler deploy --env production
  ```
- [ ] 记录生产 Worker URL（形如 `https://xiaohebao-api-production.<account>.workers.dev`）
- [ ] 用 `curl https://<worker-url>/health` 验证返回 `{"ok":true}`

---

## 三、Apple 开发者配置

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

## 四、EAS 构建 & 提交

```bash
# 1. 安装 EAS CLI
npm install -g eas-cli

# 2. 登录 Expo 账户
eas login

# 3. 构建 iOS Production
cd apps/mobile
eas build --platform ios --profile production

# 4. 构建完成后提交到 App Store Connect
eas submit --platform ios --profile production
```

---

## 五、App Store Connect 元数据

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
TODO: https://your-domain.com/privacy
```

**支持网址**（必须）
```
TODO: https://your-domain.com/support
```

---

## 六、年龄分级问卷

在 App Store Connect 的"年龄分级"问卷中，所有问题均选**无**（None），最终评级应为 **4+**。

---

## 七、定价与销售范围

- [ ] 定价：**免费**（Free）
- [ ] 销售范围：中国大陆（+ 其他目标市场按需勾选）

---

## 八、隐私数据收集声明

在 App Store Connect "App 隐私"部分声明如下：

| 数据类型 | 收集 | 用途 |
|---------|------|------|
| 姓名 | 是（Apple 登录可选提供） | App 功能 |
| 电子邮件 | 是（Apple 登录可选提供） | App 功能 |
| 财务信息（收支记录） | 是 | App 功能 |
| 身份标识符（Apple Sub） | 是 | 账户认证 |

以上数据均**关联到用户身份**，不用于**追踪**。

---

## 九、审核准备

- [ ] 在 App Store Connect 提交备注（Review Notes）中提供一个**测试账号**（或说明用 Apple Sign In 登录步骤）
- [ ] 确认 App 在 iPhone 14 / 15 真机上运行无崩溃
- [ ] 确认无硬编码 `localhost` 或 `dev-bypass` 路径残留
- [ ] 首次提交选择"当审核通过后自动发布"或手动发布均可

---

## 十、发布后

- [ ] 监控 Crash 报告（App Store Connect → 崩溃）
- [ ] 监控 Cloudflare Worker 请求日志
- [ ] 准备 1.0.1 Hotfix 分支
