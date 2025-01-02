"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogOut } from "lucide-react";

const menuItems = [
  { emoji: "📊", label: "Dashboard", href: "/dashboard" },
  { emoji: "💳", label: "Assinaturas", href: "/dashboard/subscriptions" },
  { emoji: "📈", label: "Relatórios", href: "/dashboard/reports" },
  { emoji: "👨‍👩‍👧‍👦", label: "Família", href: "/dashboard/family" },
  { emoji: "🔔", label: "Notificações", href: "/dashboard/notifications" },
  { emoji: "⚙️", label: "Configurações", href: "/dashboard/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-2 border-b border-[#1F1F22] px-6 py-4">
        <div className="rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 p-2">
          <span className="text-xl">💎</span>
        </div>
        <div>
          <h1 className="text-lg font-semibold text-white">SubWise</h1>
          <p className="text-xs text-gray-400">Gerenciador de Assinaturas</p>
        </div>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="flex flex-col gap-1 py-4">
          {menuItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 text-base",
                pathname === item.href
                  ? "bg-gradient-to-r from-purple-600/10 to-blue-500/10 text-purple-400"
                  : "text-gray-400 hover:bg-[#1F1F22] hover:text-white"
              )}
              asChild
              onClick={() => setOpen(false)}
            >
              <Link href={item.href}>
                <span className="text-xl">{item.emoji}</span>
                {item.label}
              </Link>
            </Button>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t border-[#1F1F22] p-4">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>{session?.user?.name?.[0] ?? "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">
              {session?.user?.name ?? "User"}
            </p>
            <p className="text-xs text-gray-400">
              {session?.user?.email ?? "user@example.com"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-50"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-[#111113]">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <div className="hidden md:flex h-screen w-64 flex-col border-r border-[#1F1F22] bg-[#111113]">
        <SidebarContent />
      </div>
    </>
  );
}
