import { TrendingDown, TrendingUp, Wallet, ArrowRight } from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { useNavigate } from "react-router";

export function Home() {
  const navigate = useNavigate();

  const monthlyData = {
    expense: 12580.50,
    income: 25000.00,
    balance: 12419.50,
    todayExpense: 286.00,
  };

  const recentTransactions = [
    { id: 1, name: "午餐", amount: -45.00, category: "餐饮", time: "12:30" },
    { id: 2, name: "地铁", amount: -6.00, category: "交通", time: "08:45" },
    { id: 3, name: "工资", amount: 25000.00, category: "收入", time: "昨天" },
    { id: 4, name: "咖啡", amount: -28.00, category: "餐饮", time: "昨天" },
  ];

  const categoryExpenses = [
    { name: "餐饮", amount: 3280, color: "bg-orange-500" },
    { name: "交通", amount: 850, color: "bg-blue-500" },
    { name: "购物", amount: 4200, color: "bg-purple-500" },
  ];

  const budgetProgress = 62; // 62%

  return (
    <div className="px-4 pt-12 pb-8 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <p className="text-gray-600">你好，</p>
        <h1 className="text-3xl font-semibold text-gray-900">财务概览</h1>
        <p className="text-sm text-gray-500">2026年3月25日</p>
      </div>

      {/* Monthly Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <GlassCard className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-red-600">
            <TrendingDown className="w-5 h-5" />
            <span className="text-sm">本月支出</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            ¥{monthlyData.expense.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
          </p>
        </GlassCard>

        <GlassCard className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-green-600">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm">本月收入</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            ¥{monthlyData.income.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
          </p>
        </GlassCard>
      </div>

      {/* Balance Card */}
      <GlassCard className="p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600">
            <Wallet className="w-5 h-5" />
            <span className="text-sm">本月结余</span>
          </div>
          <span className="text-xs text-gray-500">今日支出 ¥{monthlyData.todayExpense}</span>
        </div>
        <p className="text-3xl font-semibold text-gray-900">
          ¥{monthlyData.balance.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
        </p>
      </GlassCard>

      {/* Budget Progress */}
      <GlassCard className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">预算进度</span>
          <span className="text-sm text-gray-900">{budgetProgress}%</span>
        </div>
        <div className="h-3 bg-gray-200/50 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all"
            style={{ width: `${budgetProgress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-600">
          <span>已用 ¥7,750</span>
          <span>总预算 ¥12,500</span>
        </div>
      </GlassCard>

      {/* Category Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">支出分类</h3>
          <button 
            onClick={() => navigate("/app/analytics")}
            className="text-sm text-blue-600 flex items-center gap-1"
          >
            查看全部
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <GlassCard className="p-5 space-y-3">
          {categoryExpenses.map((cat) => (
            <div key={cat.name} className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${cat.color}`} />
              <span className="text-sm text-gray-700 flex-1">{cat.name}</span>
              <span className="text-sm font-medium text-gray-900">
                ¥{cat.amount.toLocaleString('zh-CN')}
              </span>
            </div>
          ))}
        </GlassCard>
      </div>

      {/* Recent Transactions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">最近账单</h3>
          <button 
            onClick={() => navigate("/app/transactions")}
            className="text-sm text-blue-600 flex items-center gap-1"
          >
            查看全部
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <GlassCard className="divide-y divide-gray-200/50">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{transaction.name}</p>
                <p className="text-xs text-gray-500">{transaction.category} · {transaction.time}</p>
              </div>
              <p className={`text-base font-semibold ${
                transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'
              }`}>
                {transaction.amount > 0 ? '+' : ''}¥{Math.abs(transaction.amount).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
              </p>
            </div>
          ))}
        </GlassCard>
      </div>
    </div>
  );
}
