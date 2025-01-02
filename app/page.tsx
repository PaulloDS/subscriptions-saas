import {
  ArrowRight,
  BarChart3,
  Clock,
  FileSignature,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "./_components/feature-card";
import { StatsCard } from "./_components/stats-card";
import { IntegrationSection } from "./_components/integration-section";
import { SiteHeader } from "./_components/site-header";
import { PricingSection } from "./_components/pricing-section";

export default function Home() {
  return (
    <main className="flex-1">
      <SiteHeader />
      {/* Hero Section */}
      <section className="gradient-bg">
        <div className="container mx-auto px-4 pt-24 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left space-y-6">
              <h1 className="text-5xl font-bold tracking-tight">
                Controle suas assinaturas. Economize{" "}
                <span className="text-lime-700">dinheiro.</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl">
                Descubra, organize e otimize todos os seus serviços de
                assinatura em um só lugar. SubWise ajuda você a gastar menos e
                aproveitar mais.
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="gap-2">
                  Começar Agora <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">
                  Agendar Demo
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4">
                <img
                  src="/dashboard-preview.png"
                  alt="Dashboard Preview"
                  className="rounded-xl w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="stats-grid">
            <StatsCard
              title="Documentos Assinados"
              value="1M+"
              description="Documentos processados com sucesso"
              icon={FileSignature}
            />
            <StatsCard
              title="Empresas Ativas"
              value="50k+"
              description="Confiam em nossa plataforma"
              icon={Users}
            />
            <StatsCard
              title="Economia de Tempo"
              value="85%"
              description="Redução no tempo de processo"
              icon={Clock}
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Por que escolher o SubWise?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Shield}
              title="Gestão Completa"
              description="Organize e acompanhe todas as suas assinaturas em um só lugar."
            />
            <FeatureCard
              icon={Zap}
              title="Economia Inteligente"
              description="Receba sugestões de economia e elimine assinaturas desnecessárias."
            />
            <FeatureCard
              icon={BarChart3}
              title="Alertas Personalizados"
              description="Nunca perca um vencimento com nossos lembretes automáticos"
            />
          </div>
        </div>
      </section>

      <IntegrationSection />

      <PricingSection />

      {/* CTA Section */}
      <section className="gradient-bg py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Comece a Transformar seu Processo de Assinaturas
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Junte-se a pessoas que já modernizaram sua gestão de assinaturas
            digitais.
          </p>
          <Button size="lg" className="gap-2">
            Começar Gratuitamente <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </main>
  );
}
