import {
  GraduationCap,
  Table2,
  FileText,
  FileCheck2,
  Map,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Deliverable {
  icon: LucideIcon;
  title: string;
  format: string;
  description: string;
}

const DELIVERABLES: Deliverable[] = [
  {
    icon: GraduationCap,
    title: "AI Literacy Training",
    format: "PPTX / PDF",
    description: "[PLACEHOLDER] Two-sentence description of the literacy training deliverable.",
  },
  {
    icon: Table2,
    title: "AI System Register",
    format: "XLSX",
    description: "[PLACEHOLDER] Two-sentence description of the system register deliverable.",
  },
  {
    icon: FileText,
    title: "Acceptable Use Policy",
    format: "DOCX",
    description: "[PLACEHOLDER] Two-sentence description of the acceptable use policy.",
  },
  {
    icon: FileCheck2,
    title: "Annex IV Lite",
    format: "DOCX",
    description: "[PLACEHOLDER] Two-sentence description of the Annex IV documentation skeleton.",
  },
  {
    icon: Map,
    title: "90-Day Roadmap",
    format: "PDF",
    description: "[PLACEHOLDER] Two-sentence description of the 90-day roadmap.",
  },
  {
    icon: ClipboardList,
    title: "Vendor Due Diligence",
    format: "DOCX / PDF",
    description: "[PLACEHOLDER] Two-sentence description of the vendor questionnaire.",
  },
];

export function Deliverables() {
  return (
    <section id="deliverables" className="border-b border-border">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight">The six deliverables</h2>
          <p className="mt-3 text-muted-foreground">
            [PLACEHOLDER] One line on what the pack contains.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DELIVERABLES.map((d) => (
            <Card key={d.title} className="bg-background">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <d.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <Badge variant="muted">{d.format}</Badge>
                </div>
                <h3 className="mt-4 font-semibold">{d.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
