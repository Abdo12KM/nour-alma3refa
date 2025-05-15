"use client";

import React from "react";
import { Header } from "@/components/layout/header";

interface MainLayoutProps {
  children: React.ReactNode;
  hideHeader?: boolean;
}

export function MainLayout({ children, hideHeader = false }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {!hideHeader && <Header />}
      <main className="flex-1">{children}</main>
    </div>
  );
}
