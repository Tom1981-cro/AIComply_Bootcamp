import { Building2, UserCog } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const PERSONAS = [
  {
    icon: Building2,
    title: "SME operations lead",
    description: "[PLACEHOLDER] Two-to-three sentences on the SME ops lead persona and why this fits them.",
  },
  {
    icon: UserCog,
    title: "GDPR / privacy consultant",
    description: "[PLACEHOLDER] Two-to-three sentences on the consultant persona and the white-label angle.",
  },
];

export function Personas() {
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-2xl font-semibold tracking-tight">Who this is for</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {PERSONAS.map((p) => (
            <Card key={p.title} className="bg-background">
              <CardContent className="p-6">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent/10 text-accent">
                  <p.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-semibold">{p.title}</h3>
                <p className="mt-2 text-muted-foreground">{p.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
