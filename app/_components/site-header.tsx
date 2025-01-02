"use client";

import { FileSignature } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileSignature className="h-6 w-6 text-primary" />
          <span className="font-semibold">AssineJá</span>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
