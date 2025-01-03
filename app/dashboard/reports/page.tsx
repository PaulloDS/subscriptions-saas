import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from "@/components/overview";
import { RecentSubscriptions } from "@/components/recent-subscriptions";
import { SubscriptionPieChart } from "@/components/subscription-pie-chart";
import { PredictionChart } from "@/components/prediction-chart";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Relatórios
        </h1>
        <p className="text-muted-foreground">
          Analise seus gastos e veja insights sobre suas assinaturas.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="by-category">Por Categoria</TabsTrigger>
          <TabsTrigger value="predictions">Previsões</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gastos Mensais</CardTitle>
              <CardDescription>
                Seus gastos com assinaturas nos últimos 6 meses
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <Overview />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Assinaturas Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentSubscriptions />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="by-category" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gastos por Categoria</CardTitle>
              <CardDescription>
                Distribuição de seus gastos por categoria
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <SubscriptionPieChart />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Previsão de Gastos</CardTitle>
              <CardDescription>
                Estimativa de gastos para os próximos 6 meses
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <PredictionChart />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
