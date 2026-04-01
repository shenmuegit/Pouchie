# 小荷包测试说明

## 一键执行

```bash
npm run typecheck
npm run test
```

## 分层测试

### 1. 领域层（核心业务规则）

```bash
npm run test --workspace @xiaohebao/domain
```

覆盖规则：

- 交易创建与分组
- 预算超支计算
- 默认分类删除转隐藏
- 统计聚合
- 会话失效

### 2. API Worker

```bash
npm run test --workspace @xiaohebao/api-worker
```

当前包含：

- 健康检查
- 登录鉴权路由可用性
- 受保护路由 token 校验
- 交易创建路由参数传递

可继续补充 D1 本地数据库的真实集成回归用例。

### 3. Mobile

```bash
npm run test --workspace @xiaohebao/mobile
```

当前包含：

- 金额格式化
- 金额文本与分值转换
- 分类预算草稿到 API payload 转换

可继续补充：

- 登录流程组件测试
- 账单编辑/删除交互测试
- 快速记账弹窗流程测试

## 手工验收清单（客户端）

1. 欢迎页 -> 登录页 -> 进入首页。
2. 新增一条支出账单，首页与账单页同步可见。
3. 账单页搜索与收支筛选可用。
4. 统计页切换日/周/月/年，摘要可刷新。
5. 预算页设置月预算后，首页预算进度变化。
6. 分类页新增/删除（默认分类会隐藏）。
7. 我的页偏好开关能持久化。
