import { useState } from "react";
import { GlassCard } from "../components/GlassCard";
import { 
  UtensilsCrossed, Car, ShoppingBag, Apple, Gamepad2, 
  Heart, BookOpen, Home, Phone, MoreHorizontal, Calendar, Check
} from "lucide-react";
import { useNavigate } from "react-router";

export function AddTransaction() {
  const navigate = useNavigate();
  const [type, setType] = useState<"expense" | "income">("expense");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("餐饮");
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const categories = [
    { id: "餐饮", label: "餐饮", icon: UtensilsCrossed, color: "text-orange-600" },
    { id: "交通", label: "交通", icon: Car, color: "text-blue-600" },
    { id: "购物", label: "购物", icon: ShoppingBag, color: "text-purple-600" },
    { id: "买菜", label: "买菜", icon: Apple, color: "text-green-600" },
    { id: "娱乐", label: "娱乐", icon: Gamepad2, color: "text-pink-600" },
    { id: "医疗", label: "医疗", icon: Heart, color: "text-red-600" },
    { id: "学习", label: "学习", icon: BookOpen, color: "text-indigo-600" },
    { id: "居住", label: "居住", icon: Home, color: "text-cyan-600" },
    { id: "通讯", label: "通讯", icon: Phone, color: "text-teal-600" },
    { id: "其他", label: "其他", icon: MoreHorizontal, color: "text-gray-600" },
  ];

  const handleSave = () => {
    // Mock save - show success animation
    setShowSuccess(true);
    setTimeout(() => {
      navigate("/app");
    }, 1500);
  };

  return (
    <div className="px-4 pt-12 pb-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-gray-900">快速记账</h1>
        <button
          onClick={() => navigate("/app")}
          className="text-sm text-gray-600 px-4 py-2"
        >
          取消
        </button>
      </div>

      {/* Type Toggle */}
      <GlassCard className="p-2 flex gap-2">
        <button
          onClick={() => setType("expense")}
          className={`flex-1 py-3 rounded-2xl transition-all ${
            type === "expense"
              ? "bg-white shadow-md text-gray-900"
              : "text-gray-600"
          }`}
        >
          支出
        </button>
        <button
          onClick={() => setType("income")}
          className={`flex-1 py-3 rounded-2xl transition-all ${
            type === "income"
              ? "bg-white shadow-md text-gray-900"
              : "text-gray-600"
          }`}
        >
          收入
        </button>
      </GlassCard>

      {/* Amount Input */}
      <GlassCard className="p-6 space-y-2">
        <label className="text-sm text-gray-600">金额</label>
        <div className="flex items-center gap-2">
          <span className="text-3xl text-gray-900">¥</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="flex-1 text-4xl font-semibold bg-transparent border-none outline-none text-gray-900 placeholder-gray-300"
            autoFocus
          />
        </div>
      </GlassCard>

      {/* Category Selection */}
      <div className="space-y-3">
        <label className="text-sm text-gray-700">选择分类</label>
        <div className="grid grid-cols-5 gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${
                  selectedCategory === cat.id
                    ? "bg-white/90 shadow-md scale-105"
                    : "bg-white/50"
                }`}
              >
                <Icon className={`w-6 h-6 ${cat.color}`} />
                <span className="text-xs text-gray-700">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Name Input */}
      <GlassCard className="p-5 space-y-2">
        <label className="text-sm text-gray-600">账单名称</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例如：午餐"
          className="w-full bg-transparent border-none outline-none text-gray-900 placeholder-gray-400"
        />
      </GlassCard>

      {/* Date */}
      <GlassCard className="p-5 flex items-center justify-between">
        <span className="text-sm text-gray-600">日期时间</span>
        <div className="flex items-center gap-2 text-gray-900">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">3月25日 14:30</span>
        </div>
      </GlassCard>

      {/* Note */}
      <GlassCard className="p-5 space-y-2">
        <label className="text-sm text-gray-600">备注（可选）</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="添加备注信息..."
          rows={3}
          className="w-full bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 resize-none"
        />
      </GlassCard>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 
                 text-white rounded-2xl shadow-lg hover:shadow-xl 
                 transition-all duration-300 active:scale-95 font-medium"
      >
        保存账单
      </button>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <GlassCard className="p-8 flex flex-col items-center gap-4 mx-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-10 h-10 text-white" />
            </div>
            <p className="text-lg font-medium text-gray-900">保存成功</p>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
