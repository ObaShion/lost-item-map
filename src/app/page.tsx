"use client";

import LostItemMap from "@/components/maps/lost-item-map";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex-1 flex overflow-hidden">
        {isSidebarOpen && (
          <div className="hidden md:flex flex-col w-64 bg-gray-900">
            <div className="pt-4 px-4">
              <h1 className="text-2xl text-white">Lost Item Maps</h1>
              {/*<Separator className="my-4" />*/}
            </div>
            <div className="flex-1">
              <Sidebar />
            </div>
            <div className="border-t p-4">
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/account" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-black text-white">OS</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-white">ユーザー名</span>
                    <span className="text-xs text-muted-foreground">アカウント設定</span>
                  </div>
                </Link>
              </Button>
            </div>
          </div>
        )}
        <main className="flex-1 relative">
          <LostItemMap />
        </main>
      </div>
    </div>
  );
}


