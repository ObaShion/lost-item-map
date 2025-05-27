import { Button } from "@/components/ui/button";
import { Home, Settings, Users } from "lucide-react";
import Link from "next/link";

export function Sidebar() {
  return (
    <div className="flex flex-col h-full w-64 bg-gray-900">
      <div className="flex-1">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold text-white">管理メニュー</h2>
            <div className="space-y-1">
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/" className="flex items-center text-white">
                  <Home className="mr-2 h-4 w-4" />
                  ダッシュボード
                </Link>
              </Button>
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/items" className="flex items-center text-white">
                  <Users className="mr-2 h-4 w-4" />
                  落とし物一覧
                </Link>
              </Button>
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/settings" className="flex items-center text-white">
                  <Settings className="mr-2 h-4 w-4" />
                  設定
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
