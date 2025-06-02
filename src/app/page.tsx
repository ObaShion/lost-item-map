"use client";

import LostItemMap from "@/components/maps/lost-item-map";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex-1 flex overflow-hidden">
        {isSidebarOpen && (
          <div className="hidden md:flex flex-col w-64 bg-white">
            <div className="pt-4 px-4">
              <h1 className="text-2xl">Lost Item Maps</h1>
              <Separator className="my-4" />
            </div>
            <div className="flex-1">
              <Sidebar />
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


