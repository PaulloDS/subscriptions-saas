"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "@/components/overview";
import { RecentSubscriptions } from "@/components/recent-subscriptions";
import { StatsCards } from "@/components/stats-cards";
import { CreditCard } from "lucide-react";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Bom dia, {session?.user.name}
          </h1>
          <p className="text-gray-400">
            Aqui está um resumo das suas assinaturas e gastos.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#111113] p-3 rounded-lg">
          <div className="text-right">
            <p className="text-sm font-medium text-white">Total Mensal</p>
            <p className="text-xl sm:text-2xl font-bold text-purple-400">
              R$ 1.249,00
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 p-2">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      <StatsCards />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="md:col-span-4 bg-[#111113] border-[#1F1F22]">
          <CardHeader>
            <CardTitle className="text-white">Visão Geral de Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <Overview />
          </CardContent>
        </Card>

        <Card className="md:col-span-3 bg-[#111113] border-[#1F1F22]">
          <CardHeader>
            <CardTitle className="text-white">Assinaturas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentSubscriptions />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
