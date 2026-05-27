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
    description:
      "A staff training deck satisfying the Article 4 literacy obligation. Covers what AI is in the Act's definition, the risk-tier framework, prohibited practices under Article 5, and role-specific responsibilities. Editable speaker notes throughout.",
  },
  {
    icon: Table2,
    title: "AI System Register",
    format: "XLSX",
    description:
      "A spreadsheet to inventory every AI system in use across the organisation — provider, purpose, risk classification, data inputs, human oversight arrangement, and Article 26 deployer obligations where applicable. The format your DPO will recognise from your RoPA.",
  },
  {
    icon: FileText,
    title: "Acceptable Use Policy",
    format: "DOCX",
    description:
      "A staff-facing policy on permitted and prohibited uses of generative and decision-support AI tools, with explicit clauses on input data, output review, and the Article 5 prohibitions translated into operational language.",
  },
  {
    icon: FileCheck2,
    title: "Annex IV Lite",
    format: "DOCX",
    description:
      "A documentation skeleton modelled on Annex IV of the Act. You will not need full Annex IV unless you become a high-risk provider, but the structure forces you to articulate intended purpose, foreseeable misuse, and oversight measures — which your insurer and your enterprise customers will ask about regardless.",
  },
  {
    icon: Map,
    title: "90-Day Roadmap",
    format: "PDF",
    description:
      "A phased implementation plan: weeks 1–4 inventory and literacy, weeks 5–8 policy and vendor review, weeks 9–13 documentation and oversight design. With owner columns, review checkpoints, and a realistic estimate of internal hours per phase.",
  },
  {
    icon: ClipboardList,
    title: "Vendor Due Diligence Questionnaire",
    format: "DOCX / PDF",
    description:
      "The questions to send your AI vendors before signing or renewing. Covers their Article 16 provider obligations, conformity assessment status, technical documentation availability, post-market monitoring, and incident reporting commitments. Returned answers slot directly into your system register.",
  },
];

export function Deliverables() {
  return (
    <section id="deliverables" className="border-b border-border bg-surface">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">03</p>
          <h2 className="mt-3 text-3xl tracking-tight">The six deliverables</h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DELIVERABLES.map((d, i) => (
            <Card key={d.title} className="flex flex-col bg-card">
              <CardContent className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between">
                  <span className="font-mono text-sm text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Badge variant="muted">{d.format}</Badge>
                </div>
                <div className="mt-5 flex items-center gap-2.5">
                  <d.icon className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                  <h3 className="text-lg leading-snug">{d.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {d.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
