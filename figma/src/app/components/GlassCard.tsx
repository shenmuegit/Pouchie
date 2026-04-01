import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function GlassCard({ children, className = "", onClick }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        backdrop-blur-xl bg-white/70 border border-white/50
        rounded-3xl shadow-lg
        ${className}
      `}
      style={{
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      }}
    >
      {children}
    </div>
  );
}
