import { useState } from "react";
import { GlassCard } from "../components/GlassCard";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function Analytics() {
  const [timePeriod, setTimePeriod] = useState<"日" | "周" | "月" | "年">("月");

  const categoryData = [
    { name: "餐饮", value: 3280, color: "#f97316" },
    { name: "交通", value: 850, color: "#3b82f6" },
    { name: "购物", value: 4200, color: "#a855f7" },
    { name: "买菜", value: 1250, color: "#22c55e" },
    { name: "娱乐", value: 980, color: "#ec4899" },
    { name: "其他", value: 1020, color: "#6b7280" },
  ];

  const trendData = [
    { date: "3/18", expense: 420, income: 0 },
    { date: "3/19", expense: 380, income: 0 },
    { date: "3/20", expense: 520, income: 0 },
    { date: "3/21", expense: 290, income: 0 },
    { date: "3/22", expense: 650, income: 0 },
    { date: "3/23", expense: 391, income: 0 },
    { date: "3/24", expense: 520, income: 25000 },
    { date: "3/25", expense: 286, income: 0 },
  ];

  const totalExpense = categoryData.reduce((sum, cat) => sum + cat.value, 0);

  return (
    <div className="px-4 pt-12 pb-8 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold text-gray-900">统计分析</h1>
        <p className="text-sm text-gray-500">数据洞察，一目了然</p>
      </div>

      {/* Time Period Selector */}
      <GlassCard className="p-2 flex gap-2">
        {(["日", "周", "月", "年"] as const).map((period) => (
          <button
            key={period}
            onClick={() => setTimePeriod(period)}
            className={`flex-1 py-3 rounded-2xl transition-all ${
              timePeriod === period
                ? "bg-white shadow-md text-gray-900"
                : "text-gray-600"
            }`}
          >
            {period}
          </button>
        ))}
      </GlassCard>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <GlassCard className="p-4 space-y-2">
          <div className="flex items-center gap-1 text-red-600">
            <TrendingDown className="w-4 h-4" />
          </div>
          <p className="text-xs text-gray-600">总支出</p>
          <p className="text-lg font-semibold text-gray-900">
            ¥{totalExpense.toLocaleString('zh-CN')}
          </p>
        </GlassCard>

        <GlassCard className="p-4 space-y-2">
          <div className="flex items-center gap-1 text-green-600">
            <TrendingUp className="w-4 h-4" />
          </div>
          <p className="text-xs text-gray-600">总收入</p>
          <p className="text-lg font-semibold text-gray-900">
            ¥25,000
          </p>
        </GlassCard>

        <GlassCard className="p-4 space-y-2">
          <div className="flex items-center gap-1 text-blue-600">
            <Wallet className="w-4 h-4" />
          </div>
          <p className="text-xs text-gray-600">净结余</p>
          <p className="text-lg font-semibold text-gray-900">
            ¥12,420
          </p>
        </GlassCard>
      </div>

      {/* Trend Chart */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">收支趋势</h3>
        <GlassCard className="p-5">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                stroke="#e5e7eb"
              />
              <YAxis 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                stroke="#e5e7eb"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '12px',
                  border: '1px solid rgba(229, 231, 235, 0.5)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="expense" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ fill: '#ef4444', r: 4 }}
                name="支出"
              />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#22c55e" 
                strokeWidth={2}
                dot={{ fill: '#22c55e', r: 4 }}
                name="收入"
              />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Category Distribution */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">支出分类占比</h3>
        <GlassCard className="p-5 space-y-4">
          {/* Pie Chart */}
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '12px',
                    border: '1px solid rgba(229, 231, 235, 0.5)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category List */}
          <div className="space-y-2">
            {categoryData.map((cat) => {
              const percentage = ((cat.value / totalExpense) * 100).toFixed(1);
              return (
                <div key={cat.name} className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-sm text-gray-700 flex-1">{cat.name}</span>
                  <span className="text-sm text-gray-500">{percentage}%</span>
                  <span className="text-sm font-medium text-gray-900">
                    ¥{cat.value.toLocaleString('zh-CN')}
                  </span>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* Daily Average */}
      <GlassCard className="p-6 space-y-2">
        <p className="text-sm text-gray-600">日均支出</p>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-semibold text-gray-900">
            ¥{(totalExpense / 30).toFixed(2)}
          </p>
          <span className="text-sm text-gray-500">/ 天</span>
        </div>
        <p className="text-xs text-gray-500">
          本月已记录 {trendData.length} 天
        </p>
      </GlassCard>
    </div>
  );
}
