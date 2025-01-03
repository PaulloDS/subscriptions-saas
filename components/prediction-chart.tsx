"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useToast } from "@/hooks/use-toast";

interface PredictionData {
  month: string;
  predicted: number;
}

export function PredictionChart() {
  const [data, setData] = useState<PredictionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await fetch("/api/subscriptions/predictions");
        if (response.ok) {
          const predictionData = await response.json();
          setData(predictionData);
        } else {
          throw new Error("Failed to fetch predictions");
        }
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Error",
          description: "Failed to fetch predictions. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPredictions();
  }, [toast]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
        <Legend />
        <Bar dataKey="predicted" fill="#8884d8" name="Predicted Spending" />
      </BarChart>
    </ResponsiveContainer>
  );
}
