"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { MobileNav } from "./mobile-nav";

interface HeaderProps {
  onSidebarToggle: () => void;
}

export function Header({ onSidebarToggle }: HeaderProps) {
  return (
    <header className="flex items-center justify-between shadow-md p-4 bg-white/90 md:hidden">
      <div className="flex items-center gap-4">
        <MobileNav />
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex"
          onClick={onSidebarToggle}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl">Lost Item Maps</h1>
      </div>
    </header>
  );
} 