import { Building2, UserCog } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const PERSONAS = [
  {
    icon: Building2,
    title: "SME operations lead",
    description:
      "You have 20–250 employees, you're using AI tools day-to-day, and someone has decided that “you” are responsible for getting compliant. You need documents your DPO or external counsel can review and adapt, not a generic whitepaper. You bill your time at internal rates and €49–149 will save you a week.",
  },
  {
    icon: UserCog,
    title: "GDPR or privacy consultant",
    description:
      "Your existing clients are asking about the AI Act and you'd rather not build templates from scratch for every engagement. The Consultant tier gives you a baseline you can rebrand, adapt to each client's sector, and deliver as part of your existing advisory work.",
  },
];

export function Personas() {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">04</p>
        <h2 className="mt-3 text-3xl tracking-tight">Who this is for</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {PERSONAS.map((p) => (
            <Card key={p.title} className="bg-card">
              <CardContent className="p-7">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-secondary/10 text-secondary">
                  <p.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-5 text-xl">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{p.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
