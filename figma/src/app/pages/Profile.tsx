import { GlassCard } from "../components/GlassCard";
import { 
  User, Lock, Cloud, DollarSign, Bell, Download, 
  ShieldCheck, Info, ChevronRight, LogOut 
} from "lucide-react";

export function Profile() {
  const settingSections = [
    {
      title: "账户设置",
      items: [
        { id: "profile", icon: User, label: "个人信息", value: "user@icloud.com", hasArrow: true },
        { id: "faceid", icon: Lock, label: "Face ID", value: "已开启", hasToggle: true, enabled: true },
      ],
    },
    {
      title: "数据同步",
      items: [
        { id: "icloud", icon: Cloud, label: "iCloud 同步", value: "已开启", hasToggle: true, enabled: true },
        { id: "backup", icon: Download, label: "数据备份", hasArrow: true },
        { id: "export", icon: Download, label: "导出数据", hasArrow: true },
      ],
    },
    {
      title: "偏好设置",
      items: [
        { id: "currency", icon: DollarSign, label: "默认货币", value: "人民币 (CNY)", hasArrow: true },
        { id: "notifications", icon: Bell, label: "通知提醒", value: "已开启", hasToggle: true, enabled: true },
      ],
    },
    {
      title: "隐私与安全",
      items: [
        { id: "privacy", icon: ShieldCheck, label: "隐私政策", hasArrow: true },
        { id: "security", icon: Lock, label: "安全设置", hasArrow: true },
      ],
    },
    {
      title: "关于",
      items: [
        { id: "about", icon: Info, label: "关于财记", value: "版本 1.0.0", hasArrow: true },
      ],
    },
  ];

  return (
    <div className="px-4 pt-12 pb-8 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold text-gray-900">我的</h1>
        <p className="text-sm text-gray-500">个人中心与设置</p>
      </div>

      {/* Profile Card */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 
                        rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900">Apple 用户</h3>
            <p className="text-sm text-gray-500">user@icloud.com</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </GlassCard>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <GlassCard className="p-4 text-center space-y-2">
          <p className="text-2xl font-semibold text-gray-900">170</p>
          <p className="text-xs text-gray-600">总账单数</p>
        </GlassCard>
        <GlassCard className="p-4 text-center space-y-2">
          <p className="text-2xl font-semibold text-gray-900">89</p>
          <p className="text-xs text-gray-600">记账天数</p>
        </GlassCard>
        <GlassCard className="p-4 text-center space-y-2">
          <p className="text-2xl font-semibold text-gray-900">10</p>
          <p className="text-xs text-gray-600">分类数量</p>
        </GlassCard>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingSections.map((section) => (
          <div key={section.title} className="space-y-3">
            <h3 className="text-sm text-gray-600 px-2">{section.title}</h3>
            <GlassCard className="divide-y divide-gray-200/50">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    className="w-full p-4 flex items-center gap-4 hover:bg-white/50 
                             transition-colors text-left"
                  >
                    <div className="p-2 bg-blue-100 rounded-xl">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base text-gray-900">{item.label}</p>
                      {item.value && (
                        <p className="text-sm text-gray-500 truncate">{item.value}</p>
                      )}
                    </div>
                    {item.hasToggle && (
                      <div className={`w-12 h-7 rounded-full transition-colors ${
                        item.enabled ? 'bg-blue-500' : 'bg-gray-300'
                      } relative`}>
                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                          item.enabled ? 'right-1' : 'left-1'
                        }`} />
                      </div>
                    )}
                    {item.hasArrow && (
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </GlassCard>
          </div>
        ))}
      </div>

      {/* Logout Button */}
      <button className="w-full p-4 bg-red-50/70 text-red-600 rounded-2xl 
                       border border-red-200 hover:bg-red-100/70 
                       transition-colors flex items-center justify-center gap-2">
        <LogOut className="w-5 h-5" />
        <span>退出登录</span>
      </button>

      {/* Footer */}
      <div className="text-center pt-4 space-y-2">
        <p className="text-xs text-gray-500">
          财记 · 优雅记录，智慧理财
        </p>
        <p className="text-xs text-gray-400">
          © 2026 财记. All rights reserved.
        </p>
      </div>
    </div>
  );
}
