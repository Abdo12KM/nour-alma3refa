import React from "react";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function PageWrapper({ children, className = "" }: PageWrapperProps) {
  return (
    <div
      className={`flex min-h-screen flex-col items-center ${className}`}
    >
      {children}
    </div>
  );
}
