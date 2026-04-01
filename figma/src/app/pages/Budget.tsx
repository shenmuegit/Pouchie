import { GlassCard } from "../components/GlassCard";
import { 
  UtensilsCrossed, Car, ShoppingBag, Apple, 
  AlertCircle, TrendingDown, Plus 
} from "lucide-react";

export function Budget() {
  const totalBudget = 12500;
  const usedBudget = 7750;
  const remainingBudget = totalBudget - usedBudget;
  const budgetProgress = (usedBudget / totalBudget) * 100;

  const categoryBudgets = [
    { 
      id: 1, 
      name: "餐饮", 
      icon: UtensilsCrossed, 
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      budget: 3000, 
      used: 2280,
      isOverBudget: false 
    },
    { 
      id: 2, 
      name: "交通", 
      icon: Car, 
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      budget: 800, 
      used: 650,
      isOverBudget: false 
    },
    { 
      id: 3, 
      name: "购物", 
      icon: ShoppingBag, 
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      budget: 4000, 
      used: 4200,
      isOverBudget: true 
    },
    { 
      id: 4, 
      name: "买菜", 
      icon: Apple, 
      color: "text-green-600",
      bgColor: "bg-green-100",
      budget: 1500, 
      used: 620,
      isOverBudget: false 
    },
  ];

  const isNearLimit = budgetProgress >= 80 && budgetProgress < 100;
  const isOverBudget = budgetProgress >= 100;

  return (
    <div className="px-4 pt-12 pb-8 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold text-gray-900">预算管理</h1>
        <p className="text-sm text-gray-500">合理规划，控制开支</p>
      </div>

      {/* Total Budget Overview */}
      <GlassCard className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-gray-600">本月预算</p>
            <p className="text-3xl font-semibold text-gray-900">
              ¥{totalBudget.toLocaleString('zh-CN')}
            </p>
          </div>
          {isOverBudget && (
            <div className="px-3 py-1 bg-red-100 rounded-full flex items-center gap-1">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-xs text-red-600">超支</span>
            </div>
          )}
          {isNearLimit && !isOverBudget && (
            <div className="px-3 py-1 bg-orange-100 rounded-full flex items-center gap-1">
              <AlertCircle className="w-4 h-4 text-orange-600" />
              <span className="text-xs text-orange-600">接近上限</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200/50 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${
                isOverBudget 
                  ? 'bg-gradient-to-r from-red-500 to-red-600'
                  : isNearLimit
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600'
              }`}
              style={{ width: `${Math.min(budgetProgress, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              已用 ¥{usedBudget.toLocaleString('zh-CN')}
            </span>
            <span className={`font-medium ${
              isOverBudget ? 'text-red-600' : 'text-gray-900'
            }`}>
              {budgetProgress.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="space-y-1">
            <p className="text-xs text-gray-600">剩余预算</p>
            <p className={`text-xl font-semibold ${
              remainingBudget < 0 ? 'text-red-600' : 'text-gray-900'
            }`}>
              ¥{remainingBudget.toLocaleString('zh-CN')}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-600">日均可用</p>
            <p className="text-xl font-semibold text-gray-900">
              ¥{(remainingBudget / 6).toFixed(2)}
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Alert Messages */}
      {isOverBudget && (
        <GlassCard className="p-4 bg-red-50/70 border-red-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900">预算超支提醒</p>
              <p className="text-xs text-red-700 mt-1">
                本月支出已超出预算 ¥{Math.abs(remainingBudget).toLocaleString('zh-CN')}，建议减少非必要开支
              </p>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Category Budgets */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">分类预算</h3>
          <button className="p-2 text-blue-600">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {categoryBudgets.map((cat) => {
            const Icon = cat.icon;
            const progress = (cat.used / cat.budget) * 100;
            const remaining = cat.budget - cat.used;

            return (
              <GlassCard key={cat.id} className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 ${cat.bgColor} rounded-xl`}>
                      <Icon className={`w-5 h-5 ${cat.color}`} />
                    </div>
                    <div>
                      <p className="text-base font-medium text-gray-900">{cat.name}</p>
                      <p className="text-xs text-gray-500">
                        ¥{cat.used.toLocaleString('zh-CN')} / ¥{cat.budget.toLocaleString('zh-CN')}
                      </p>
                    </div>
                  </div>
                  {cat.isOverBudget && (
                    <div className="px-2 py-1 bg-red-100 rounded-lg">
                      <span className="text-xs text-red-600">超支</span>
                    </div>
                  )}
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="h-2 bg-gray-200/50 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        cat.isOverBudget 
                          ? 'bg-red-500'
                          : progress >= 80
                          ? 'bg-orange-500'
                          : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-xs ${
                      cat.isOverBudget ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {cat.isOverBudget 
                        ? `超支 ¥${Math.abs(remaining).toLocaleString('zh-CN')}`
                        : `剩余 ¥${remaining.toLocaleString('zh-CN')}`
                      }
                    </span>
                    <span className={`text-xs font-medium ${
                      cat.isOverBudget ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Insights */}
      <GlassCard className="p-5 space-y-3">
        <div className="flex items-center gap-2 text-blue-600">
          <TrendingDown className="w-5 h-5" />
          <h4 className="font-medium">预算洞察</h4>
        </div>
        <div className="space-y-2 text-sm text-gray-700">
          <p>• 购物类别已超支，建议本月减少该类开支</p>
          <p>• 买菜预算使用率较低，可适当增加健康饮食</p>
          <p>• 本月预计可节省约 ¥2,000</p>
        </div>
      </GlassCard>
    </div>
  );
}
