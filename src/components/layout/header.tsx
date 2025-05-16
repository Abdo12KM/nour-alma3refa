"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { NavigationToggle } from "@/components/ui/navigation-toggle";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth";
import { BookOpenIcon, Lightbulb, LogOutIcon, UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="w-full p-4 border-b shadow-sm bg-background sticky top-0 z-20">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold flex items-center gap-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
        >
          نور المعرفة
          <Lightbulb className="w-6 h-6 text-blue-500" />
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 ">
            <ThemeToggle />
            <NavigationToggle />
          </div>

          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <UserIcon className="me-2 h-4 w-4" />
                  الحساب
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/profile")}>
                  <UserIcon className="me-2 h-4 w-4" />
                  الملف الشخصي
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/learn")}>
                  <BookOpenIcon className="me-2 h-4 w-4" />
                  الدروس
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                  <LogOutIcon className="me-2 h-4 w-4" />
                  تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
