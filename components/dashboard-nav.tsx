import Link from "next/link"
import { BarChart3, CreditCard, Home, Settings, Users } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function DashboardNav() {
  const items = [
    {
      title: "Home",
      icon: Home,
      href: "/dashboard",
    },
    {
      title: "Subscriptions",
      icon: CreditCard,
      href: "/dashboard/subscriptions",
    },
    {
      title: "Analytics",
      icon: BarChart3,
      href: "/dashboard/analytics",
    },
    {
      title: "Family",
      icon: Users,
      href: "/dashboard/family",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
    },
  ]

  return (
    <nav className="grid items-start gap-2">
      {items.map((item, index) => (
        <Link key={index} href={item.href}>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-2 font-normal hover:bg-transparent hover:underline",
              "data-[active]:bg-muted"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Button>
        </Link>
      ))}
    </nav>
  )
}

