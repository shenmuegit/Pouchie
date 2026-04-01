import { Apple, ShieldCheck, Lock, Eye } from "lucide-react";
import { useNavigate } from "react-router";
import { GlassCard } from "../components/GlassCard";

export function SignIn() {
  const navigate = useNavigate();

  const handleSignIn = () => {
    // Mock sign in - navigate to app
    navigate("/app");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50" />
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-50/50 via-transparent to-pink-50/50" />
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md space-y-8">
          {/* Title */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-semibold text-gray-900">欢迎使用财记</h2>
            <p className="text-gray-600">安全登录，开启您的理财之旅</p>
          </div>

          {/* Sign In Card */}
          <GlassCard className="p-8 space-y-6">
            <button
              onClick={handleSignIn}
              className="w-full py-4 px-6 bg-black text-white rounded-2xl 
                       shadow-lg hover:shadow-xl transition-all duration-300
                       active:scale-95 flex items-center justify-center gap-3"
            >
              <Apple className="w-6 h-6" fill="currentColor" />
              <span>使用 Apple 登录</span>
            </button>

            <div className="pt-4 space-y-3">
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p>您的账户通过 Apple 身份验证保护</p>
              </div>
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p>所有数据经过端到端加密存储</p>
              </div>
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <Eye className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p>支持 Face ID 快速解锁</p>
              </div>
            </div>
          </GlassCard>

          {/* Privacy Notice */}
          <p className="text-center text-xs text-gray-500">
            登录即表示您同意我们的服务条款和隐私政策
            <br />
            财记承诺不会与第三方分享您的个人数据
          </p>
        </div>
      </div>
    </div>
  );
}
