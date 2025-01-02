import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function IntegrationSection() {
  const integrations = [
    "https://i.imgur.com/QyfpuIs.png",
    "https://i.imgur.com/tD7HBxb.png",
    "https://i.imgur.com/d7jaRJR.png",
    "https://i.imgur.com/njsU5ii.png",
    "https://i.imgur.com/eDegohp.png",
    "https://i.imgur.com/dbdJeke.png",
    "https://i.imgur.com/EPSjApj.png",
    "https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg",
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <Card className="bg-accent/5 border-accent/20">
          <CardContent className="p-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">
                  Gerencie suas assinaturas favoritas
                </h2>
                <p className="text-muted-foreground mb-6">
                  Deixe a desorganização para trás. Com o SubWise, você tem
                  controle total das suas assinaturas, economizando tempo e
                  dinheiro.
                </p>
                <Button className="gap-2  hover:bg/90">
                  Ver todas integrações <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 ">
                {integrations.map((integration) => (
                  <div
                    key={integration}
                    className="rounded-lg p-4 flex justify-center items-center text-sm font-medium"
                  >
                    <img src={integration} alt="image" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
