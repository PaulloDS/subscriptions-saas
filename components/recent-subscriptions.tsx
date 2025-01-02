"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Subscription {
  id: string;
  name: string;
  price: number;
  category: string;
  nextBillingDate: string;
}

export function RecentSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch("/api/subscriptions");
        if (response.ok) {
          const data = await response.json();
          setSubscriptions(data.slice(0, 3)); // Get only the 3 most recent subscriptions
        } else {
          console.error("Failed to fetch subscriptions");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {subscriptions.map((subscription) => (
        <div
          key={subscription.id}
          className="flex flex-col sm:flex-row sm:items-center gap-4"
        >
          <Avatar className={`h-9 w-9 bg-primary`}>
            <AvatarImage
              src={`https://avatar.vercel.sh/${subscription.name}`}
              alt={subscription.name}
            />
            <AvatarFallback>{subscription.name[0]}</AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex-1">
            <p className="text-sm font-medium leading-none text-white">
              {subscription.name}
            </p>
            <p className="text-sm text-gray-400">{subscription.category}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-white">
              R$ {subscription.price.toFixed(2)}
            </p>
            <p className="text-sm text-gray-400">
              Renovação:{" "}
              {new Date(subscription.nextBillingDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
