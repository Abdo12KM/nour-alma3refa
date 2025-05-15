"use client";

import React from "react";

interface MainLayoutProps {
  children: React.ReactNode;
  hideHeader?: boolean;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="h-full flex flex-col bg-background">
      <main className="flex-1">{children}</main>
    </div>
  );
}
