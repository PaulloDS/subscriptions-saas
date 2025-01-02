"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { SubscriptionList } from "@/components/subscription-list";
import { AddSubscriptionDialog } from "@/components/add-subscription-dialog";

export default function SubscriptionsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSubscriptionAdded = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Assinaturas
          </h1>
          <p className="text-muted-foreground">
            Gerencie suas assinaturas ativas e inativas.
          </p>
        </div>
        <AddSubscriptionDialog onSubscriptionAdded={handleSubscriptionAdded}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Assinatura
          </Button>
        </AddSubscriptionDialog>
      </div>

      <SubscriptionList key={refreshKey} />
    </div>
  );
}
