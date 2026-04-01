import { GlassCard } from "../components/GlassCard";
import { 
  UtensilsCrossed, Car, ShoppingBag, Apple, Gamepad2, 
  Heart, BookOpen, Home, Phone, MoreHorizontal, Plus, Edit2 
} from "lucide-react";

export function Categories() {
  const expenseCategories = [
    { id: 1, name: "餐饮", icon: UtensilsCrossed, color: "#f97316", count: 45 },
    { id: 2, name: "交通", icon: Car, color: "#3b82f6", count: 28 },
    { id: 3, name: "购物", icon: ShoppingBag, color: "#a855f7", count: 15 },
    { id: 4, name: "买菜", icon: Apple, color: "#22c55e", count: 32 },
    { id: 5, name: "娱乐", icon: Gamepad2, color: "#ec4899", count: 12 },
    { id: 6, name: "医疗", icon: Heart, color: "#ef4444", count: 3 },
    { id: 7, name: "学习", icon: BookOpen, color: "#6366f1", count: 8 },
    { id: 8, name: "居住", icon: Home, color: "#06b6d4", count: 5 },
    { id: 9, name: "通讯", icon: Phone, color: "#14b8a6", count: 4 },
    { id: 10, name: "其他", icon: MoreHorizontal, color: "#6b7280", count: 18 },
  ];

  const incomeCategories = [
    { id: 11, name: "工资", icon: UtensilsCrossed, color: "#22c55e", count: 1 },
    { id: 12, name: "奖金", icon: UtensilsCrossed, color: "#10b981", count: 0 },
    { id: 13, name: "投资", icon: UtensilsCrossed, color: "#059669", count: 2 },
    { id: 14, name: "其他收入", icon: MoreHorizontal, color: "#6b7280", count: 1 },
  ];

  return (
    <div className="px-4 pt-12 pb-8 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold text-gray-900">分类管理</h1>
        <p className="text-sm text-gray-500">自定义收支分类</p>
      </div>

      {/* Expense Categories */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">支出分类</h3>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm 
                           flex items-center gap-2 shadow-md hover:shadow-lg 
                           transition-all active:scale-95">
            <Plus className="w-4 h-4" />
            新增
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {expenseCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <GlassCard 
                key={cat.id} 
                className="p-4 space-y-3 hover:shadow-xl transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div 
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: `${cat.color}15` }}
                  >
                    <Icon 
                      className="w-6 h-6" 
                      style={{ color: cat.color }}
                    />
                  </div>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <p className="text-base font-medium text-gray-900">{cat.name}</p>
                  <p className="text-xs text-gray-500">{cat.count} 笔记录</p>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Income Categories */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">收入分类</h3>
          <button className="px-4 py-2 bg-green-500 text-white rounded-xl text-sm 
                           flex items-center gap-2 shadow-md hover:shadow-lg 
                           transition-all active:scale-95">
            <Plus className="w-4 h-4" />
            新增
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {incomeCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <GlassCard 
                key={cat.id} 
                className="p-4 space-y-3 hover:shadow-xl transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div 
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: `${cat.color}15` }}
                  >
                    <Icon 
                      className="w-6 h-6" 
                      style={{ color: cat.color }}
                    />
                  </div>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <p className="text-base font-medium text-gray-900">{cat.name}</p>
                  <p className="text-xs text-gray-500">{cat.count} 笔记录</p>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Tips */}
      <GlassCard className="p-5 space-y-2 bg-blue-50/70 border-blue-200">
        <h4 className="text-sm font-medium text-blue-900">💡 使用提示</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• 点击分类卡片可编辑名称、图标和颜色</li>
          <li>• 建议保持分类数量在10个以内，便于快速记账</li>
          <li>• 默认分类无法删除，但可以隐藏</li>
        </ul>
      </GlassCard>
    </div>
  );
}
