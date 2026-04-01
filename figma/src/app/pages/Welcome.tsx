import { Wallet } from "lucide-react";
import { useNavigate } from "react-router";
import { GlassCard } from "../components/GlassCard";

export function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50" />
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-50/50 via-transparent to-pink-50/50" />
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <GlassCard className="p-6">
              <Wallet className="w-16 h-16 text-blue-600" />
            </GlassCard>
          </div>

          {/* Title */}
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-semibold text-gray-900">财记</h1>
            <p className="text-lg text-gray-600">优雅记录，智慧理财</p>
          </div>

          {/* CTA Button */}
          <div className="pt-8">
            <button
              onClick={() => navigate("/signin")}
              className="w-full py-4 px-6 bg-black text-white rounded-2xl 
                       shadow-lg hover:shadow-xl transition-all duration-300
                       active:scale-95"
            >
              使用 Apple 登录
            </button>
          </div>

          {/* Footer text */}
          <p className="text-center text-sm text-gray-500 pt-4">
            您的财务数据通过端到端加密保护
          </p>
        </div>
      </div>
    </div>
  );
}
