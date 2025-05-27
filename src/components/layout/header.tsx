"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
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
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" className="relative h-10 w-10 rounded-full">
          <Link href="/account">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-black text-white">OS</AvatarFallback>
            </Avatar>
          </Link>
        </Button>
      </div>
    </header>
  );
} 