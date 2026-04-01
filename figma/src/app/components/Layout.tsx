import { Outlet, useNavigate, useLocation } from "react-router";
import { Home, Receipt, PlusCircle, BarChart3, User } from "lucide-react";
import { GlassCard } from "./GlassCard";

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: "home", label: "首页", icon: Home, path: "/app" },
    { id: "transactions", label: "账单", icon: Receipt, path: "/app/transactions" },
    { id: "add", label: "记账", icon: PlusCircle, path: "/app/add", special: true },
    { id: "analytics", label: "统计", icon: BarChart3, path: "/app/analytics" },
    { id: "profile", label: "我的", icon: User, path: "/app/profile" },
  ];

  const isActive = (path: string) => {
    if (path === "/app") {
      return location.pathname === "/app";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen relative overflow-hidden pb-24">
      {/* Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 -z-10" />
      <div className="fixed inset-0 bg-gradient-to-tr from-purple-50/50 via-transparent to-pink-50/50 -z-10" />
      
      {/* Floating orbs */}
      <div className="fixed top-20 left-10 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl -z-10" />
      <div className="fixed bottom-40 right-10 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl -z-10" />

      {/* Main Content */}
      <div className="relative z-10">
        <Outlet />
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6">
        <GlassCard className="px-4 py-3">
          <div className="flex items-center justify-around">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = isActive(tab.path);
              
              if (tab.special) {
                return (
                  <button
                    key={tab.id}
                    onClick={() => navigate(tab.path)}
                    className="flex flex-col items-center gap-1 -mt-8"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 
                                  rounded-full flex items-center justify-center
                                  shadow-lg shadow-blue-500/30">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-xs text-gray-600">{tab.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={tab.id}
                  onClick={() => navigate(tab.path)}
                  className="flex flex-col items-center gap-1 py-1 px-3 transition-colors"
                >
                  <Icon className={`w-6 h-6 ${active ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className={`text-xs ${active ? 'text-blue-600' : 'text-gray-500'}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
