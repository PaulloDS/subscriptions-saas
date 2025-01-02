/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Subscription {
  id: string;
  name: string;
  category: string;
  price: number;
  billingCycle: string;
  status: string;
}

export function SubscriptionList() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();
  const { toast } = useToast();

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (status === "authenticated") {
        try {
          const response = await fetch("/api/subscriptions");
          if (response.ok) {
            const data = await response.json();
            setSubscriptions(data);
          } else {
            throw new Error("Failed to fetch subscriptions");
          }
        } catch (error) {
          console.error("Error fetching subscriptions:", error);
          toast({
            title: "Error",
            description: "Failed to fetch subscriptions. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchSubscriptions();
  }, [status, toast]);

  const filteredSubscriptions = subscriptions.filter(
    (sub) =>
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === "all" || sub.category === categoryFilter)
  );

  if (status === "loading" || isLoading) {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <div>Please log in to view your subscriptions.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Assinaturas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
          <div className="w-full sm:w-1/2">
            <Label htmlFor="search" className="sr-only">
              Buscar assinaturas
            </Label>
            <Input
              id="search"
              placeholder="Buscar assinaturas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-1/2">
            <Label htmlFor="category-filter" className="sr-only">
              Filtrar por categoria
            </Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger id="category-filter">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="Entretenimento">Entretenimento</SelectItem>
                <SelectItem value="Música">Música</SelectItem>
                <SelectItem value="Trabalho">Trabalho</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {filteredSubscriptions.length === 0 ? (
          <p>No subscriptions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Ciclo de Cobrança</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscriptions.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell>{subscription.name}</TableCell>
                    <TableCell>{subscription.category}</TableCell>
                    <TableCell>R$ {subscription.price.toFixed(2)}</TableCell>
                    <TableCell>{subscription.billingCycle}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          subscription.status === "Ativa"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {subscription.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
