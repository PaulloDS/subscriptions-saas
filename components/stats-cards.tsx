"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, CreditCard, Users, Wallet } from "lucide-react";

interface Stats {
  totalSpending: number;
  activeSubscriptions: number;
  familyMembers: number;
}

export function StatsCards() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          console.error("Failed to fetch stats");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!stats) {
    return <div>Error loading stats</div>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card className="bg-gradient-to-br from-purple-600 to-blue-500">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/80">Gasto Total</p>
              <p className="text-2xl font-bold text-white">
                R$ {stats.totalSpending.toFixed(2)}
              </p>
            </div>
            <div className="rounded-full bg-white/10 p-3">
              <Wallet className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-white/80">
            <ArrowUp className="h-4 w-4" />
            <span className="text-sm">+2% em relação ao mês passado</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#111113] border-[#1F1F22]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">
                Assinaturas Ativas
              </p>
              <p className="text-2xl font-bold text-white">
                {stats.activeSubscriptions}
              </p>
            </div>
            <div className="rounded-full bg-purple-500/10 p-3">
              <CreditCard className="h-5 w-5 text-purple-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-gray-400">
            <ArrowUp className="h-4 w-4 text-green-400" />
            <span className="text-sm">+2 desde o último mês</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#111113] border-[#1F1F22]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">
                Membros da Família
              </p>
              <p className="text-2xl font-bold text-white">
                {stats.familyMembers}
              </p>
            </div>
            <div className="rounded-full bg-blue-500/10 p-3">
              <Users className="h-5 w-5 text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-gray-400">
            <ArrowUp className="h-4 w-4 text-green-400" />
            <span className="text-sm">+1 novo membro adicionado</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
