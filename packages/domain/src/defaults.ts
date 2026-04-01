import type { CreateCategoryRequest, TransactionType } from "@xiaohebao/contracts";

type PresetCategory = Omit<CreateCategoryRequest, "type"> & {
  type: TransactionType;
};

export const DEFAULT_CATEGORIES: PresetCategory[] = [
  { type: "expense", name: "餐饮", icon: "utensils", color: "#f97316" },
  { type: "expense", name: "交通", icon: "car", color: "#3b82f6" },
  { type: "expense", name: "购物", icon: "shopping", color: "#a855f7" },
  { type: "expense", name: "买菜", icon: "apple", color: "#22c55e" },
  { type: "expense", name: "娱乐", icon: "gamepad", color: "#ec4899" },
  { type: "expense", name: "医疗", icon: "heart", color: "#ef4444" },
  { type: "expense", name: "学习", icon: "book", color: "#6366f1" },
  { type: "expense", name: "居住", icon: "home", color: "#06b6d4" },
  { type: "expense", name: "通讯", icon: "phone", color: "#14b8a6" },
  { type: "expense", name: "其他", icon: "more", color: "#6b7280" },
  { type: "income", name: "工资", icon: "wallet", color: "#22c55e" },
  { type: "income", name: "奖金", icon: "gift", color: "#10b981" },
  { type: "income", name: "投资", icon: "chart", color: "#059669" },
  { type: "income", name: "其他收入", icon: "more", color: "#16a34a" }
];

export const DEFAULT_PREFERENCES = {
  faceIdEnabled: true,
  defaultCurrency: "CNY" as const,
  notificationsEnabled: true,
  iCloudSyncStatus: "占位：未接入 iCloud，同步功能将在后续版本开放",
  exportStatus: "占位：导出功能将在后续版本开放"
};

