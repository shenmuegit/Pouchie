import { useState } from "react";
import { GlassCard } from "../components/GlassCard";
import { Search, SlidersHorizontal, Trash2 } from "lucide-react";

export function Transactions() {
  const [activeTab, setActiveTab] = useState<"all" | "expense" | "income">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const transactions = [
    { id: 1, date: "2026年3月25日", items: [
      { id: 101, name: "午餐", amount: -45.00, category: "餐饮", time: "12:30" },
      { id: 102, name: "地铁", amount: -6.00, category: "交通", time: "08:45" },
    ]},
    { id: 2, date: "2026年3月24日", items: [
      { id: 201, name: "工资", amount: 25000.00, category: "收入", time: "10:00" },
      { id: 202, name: "咖啡", amount: -28.00, category: "餐饮", time: "15:20" },
      { id: 203, name: "打车", amount: -35.00, category: "交通", time: "18:30" },
    ]},
    { id: 3, date: "2026年3月23日", items: [
      { id: 301, name: "超市购物", amount: -186.50, category: "买菜", time: "16:00" },
      { id: 302, name: "电影票", amount: -80.00, category: "娱乐", time: "19:30" },
      { id: 303, name: "晚餐", amount: -125.00, category: "餐饮", time: "20:30" },
    ]},
  ];

  const filteredTransactions = transactions.map(group => ({
    ...group,
    items: group.items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = 
        activeTab === "all" ||
        (activeTab === "expense" && item.amount < 0) ||
        (activeTab === "income" && item.amount > 0);
      return matchesSearch && matchesTab;
    })
  })).filter(group => group.items.length > 0);

  const getTabCount = (tab: "all" | "expense" | "income") => {
    const allItems = transactions.flatMap(g => g.items);
    if (tab === "all") return allItems.length;
    if (tab === "expense") return allItems.filter(i => i.amount < 0).length;
    return allItems.filter(i => i.amount > 0).length;
  };

  return (
    <div className="px-4 pt-12 pb-8 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold text-gray-900">账单明细</h1>
        <p className="text-sm text-gray-500">所有收支记录</p>
      </div>

      {/* Search Bar */}
      <GlassCard className="p-4 flex items-center gap-3">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索账单..."
          className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400"
        />
        <button className="p-2">
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
        </button>
      </GlassCard>

      {/* Tabs */}
      <GlassCard className="p-2 flex gap-2">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex-1 py-3 rounded-2xl transition-all ${
            activeTab === "all"
              ? "bg-white shadow-md text-gray-900"
              : "text-gray-600"
          }`}
        >
          全部 ({getTabCount("all")})
        </button>
        <button
          onClick={() => setActiveTab("expense")}
          className={`flex-1 py-3 rounded-2xl transition-all ${
            activeTab === "expense"
              ? "bg-white shadow-md text-gray-900"
              : "text-gray-600"
          }`}
        >
          支出 ({getTabCount("expense")})
        </button>
        <button
          onClick={() => setActiveTab("income")}
          className={`flex-1 py-3 rounded-2xl transition-all ${
            activeTab === "income"
              ? "bg-white shadow-md text-gray-900"
              : "text-gray-600"
          }`}
        >
          收入 ({getTabCount("income")})
        </button>
      </GlassCard>

      {/* Transaction List */}
      <div className="space-y-6">
        {filteredTransactions.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <p className="text-gray-500">暂无账单记录</p>
          </GlassCard>
        ) : (
          filteredTransactions.map((group) => (
            <div key={group.id} className="space-y-3">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-sm text-gray-600">{group.date}</h3>
                <span className="text-xs text-gray-500">
                  {group.items.length} 笔
                </span>
              </div>
              <GlassCard className="divide-y divide-gray-200/50">
                {group.items.map((item) => (
                  <div key={item.id} className="p-4 flex items-center gap-4 group">
                    <div className="flex-1">
                      <p className="text-base font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.category} · {item.time}</p>
                    </div>
                    <p className={`text-lg font-semibold ${
                      item.amount > 0 ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {item.amount > 0 ? '+' : ''}¥{Math.abs(item.amount).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                    </p>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2">
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                ))}
              </GlassCard>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
