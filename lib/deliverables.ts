/**
 * Single source of truth for the six deliverables.
 *
 * Used by:
 *  - the landing-page deliverables grid (short descriptions, format, cover)
 *  - the per-deliverable product pages at /products/[slug]
 *
 * Long-form copy (productPageHeadline / Body / whatsInside) is sourced from
 * the launch-kit markdown and product READMEs shipped in the deliverable
 * bundles. Where a deliverable has no launch kit yet, the copy is marked
 * [PLACEHOLDER] and listed in MANUAL-CONTENT-TODO.md.
 */

export type DeliverableIcon =
  | "literacy"
  | "register"
  | "aup"
  | "techdoc"
  | "roadmap"
  | "vendor";

export interface Deliverable {
  slug: string;
  number: string; // "01" — display index
  title: string;
  /** Short format string for the landing card badge, e.g. "DOCX / PDF". */
  format: string;
  /** 2-sentence description for the landing card. */
  shortDescription: string;
  /** Path under /public to the square cover PNG, if available. */
  cover?: string;
  /** Path under /public to the carousel PDF (used as "see a sample"). */
  carouselPdf?: string;
  /** Hero headline on the product page. */
  productPageHeadline: string;
  /** Sub-line on the product page. */
  productPageSubhead: string;
  /** Body paragraphs on the product page. */
  productPageBody: string[];
  /** Bullet list of what's inside the deliverable bundle. */
  whatsInside: string[];
  /** Slugs of related deliverables (rendered as "pairs with" cards). */
  pairsWith: string[];
  /** Icon key used by the rendering component. */
  icon: DeliverableIcon;
}

export const DELIVERABLES: Deliverable[] = [
  {
    slug: "ai-literacy-training",
    number: "01",
    title: "AI Literacy Training",
    format: "PPTX / DOCX / XLSX",
    shortDescription:
      "A staff training pack satisfying the Article 4 literacy obligation. Trainer's guide, three-tier quizzes, attendance register, certificate, and an evidence-dossier checklist.",
    productPageHeadline: "Article 4 AI literacy, evidenced.",
    productPageSubhead:
      "A complete training pack — trainer's guide, three-tier quizzes, attendance register, certificate, and the evidence dossier — drafted to satisfy Article 4 with a posture an authority can actually inspect.",
    productPageBody: [
      "Article 4 of the AI Act has been in force since 2 February 2025. It is a continuous obligation, not a one-off training event, and it has to be evidenced. The pack gives an SME everything to run the programme and to produce — within one working day — the training history of any named individual on request.",
      "Three calibrated tiers (executive, operational, technical) align with the Article 4 calibration factors, so the proportionality choices are defensible. The attendance register is GDPR-minimised by design, and the evidence dossier is structured as a three-tier readiness gradient that mirrors how supervisory authorities actually escalate inquiries.",
    ],
    whatsInside: [
      "Trainer's guide (DOCX)",
      "Three-tier quizzes — executive / operational / technical (DOCX) + combined CSV",
      "Attendance register (XLSX) with schema notes",
      "Certificate template (DOCX)",
      "Evidence-dossier checklist (DOCX)",
    ],
    pairsWith: ["ai-system-register", "acceptable-use-policy"],
    icon: "literacy",
  },
  {
    slug: "ai-system-register",
    number: "02",
    title: "AI System Register",
    format: "XLSX",
    shortDescription:
      "Inventory every AI system in use — provider, purpose, risk classification, data inputs, human oversight, Article 26 deployer obligations. The format your DPO will recognise from your RoPA.",
    cover: "/marketing/covers/system-register.png",
    carouselPdf: "/marketing/carousels/system-register.pdf",
    productPageHeadline:
      "One workbook. Four sheets. The compliance posture of your AI estate, on one screen.",
    productPageSubhead:
      "Twenty mandatory columns, ten optional, data validation built in. Decision tree, five worked examples, and instructions. Designed to be the documentary substrate of your AI Act and GDPR position.",
    productPageBody: [
      "The single most important rule: one row per intended purpose, not one row per tool. The same Copilot or ChatGPT licence generates multiple rows if used across HR, customer service, and general productivity. Article 6 classification turns on intended purpose; registering at tool level produces wrong classifications for at least some rows.",
      "Decision-Tree walks classification in order — Article 5 prohibitions first (because violations are non-remediable), then Annex I product safety, then Annex III categories with the Article 6(3) derogation tested explicitly, then Article 50 transparency overlays, then GPAI obligations. Worked-Examples covers five SME deployments end-to-end including ChatGPT Enterprise, an HR CV-screener, and a Microsoft 365 Copilot deployment.",
    ],
    whatsInside: [
      "AI System Register workbook (XLSX) — Register, Decision-Tree, Worked-Examples, Instructions",
      "Register quickstart — 10-minute orientation (PDF + editable DOCX)",
      "Product README with five-week workflow",
    ],
    pairsWith: ["acceptable-use-policy", "annex-iv-techdoc"],
    icon: "register",
  },
  {
    slug: "acceptable-use-policy",
    number: "03",
    title: "Acceptable Use Policy",
    format: "DOCX / PDF",
    shortDescription:
      "A staff-facing policy on permitted and prohibited uses of generative and decision-support AI tools, with explicit clauses on input data, output review, and Article 5 prohibitions translated into operational language.",
    cover: "/marketing/covers/acceptable-use-policy.png",
    carouselPdf: "/marketing/carousels/acceptable-use-policy.pdf",
    productPageHeadline: "A defensible AI Acceptable Use Policy, ready to adapt.",
    productPageSubhead:
      "Ten sections, six to ten pages of substantive content, drafted Ireland-default with inline flags for re-pointing to other Member States. Cites the AI Act and the GDPR article-by-article where relevant.",
    productPageBody: [
      "§1 Scope · §2 Definitions · §3 Permitted Uses · §4 Prohibited Uses · §5 Data Handling · §6 Employee Responsibilities · §7 Approval Workflow for New AI Tools · §8 Incident Reporting · §9 Review and Update Cadence · §10 Sign-Off and Acknowledgement.",
      "Bracketed placeholders appear throughout for organisation-specific values — DPO contact, governing law, retention periods. The Policy refers to the AI System Register throughout (especially §7) and assumes it exists. A reasonable adaptation cadence runs five weeks: read with the owner, pair with the Register, senior approval, publish, then formally open the §7 New Tool Request route.",
    ],
    whatsInside: [
      "AI Acceptable Use Policy — editable Word template (DOCX)",
      "Locked PDF reference copy",
      "AUP quickstart (PDF + editable DOCX)",
      "Product README with five-week adaptation cadence",
    ],
    pairsWith: ["ai-system-register", "ai-literacy-training"],
    icon: "aup",
  },
  {
    slug: "annex-iv-techdoc",
    number: "04",
    title: "Annex IV Lite Technical Documentation",
    format: "DOCX / XLSX",
    shortDescription:
      "A documentation skeleton modelled on Annex IV of the Act. The structure forces you to articulate intended purpose, foreseeable misuse, and oversight measures — which insurers and enterprise customers will ask about regardless.",
    productPageHeadline:
      "Annex IV in simplified form — the dossier an SME provider can actually maintain.",
    productPageSubhead:
      "Built on the Article 11(1) simplified-form permission for SMEs. Twenty-four pages of scaffold across the nine-point Annex IV structure, plus two Excel companion workbooks for §4 metrics and §9 post-market monitoring.",
    productPageBody: [
      "§1 General description · §2 Detailed description of elements and development · §3 Monitoring, functioning and control · §4 Appropriateness of performance metrics · §5 Risk management system per Article 9 · §6 Relevant changes through the lifecycle · §7 Harmonised standards · §8 EU declaration of conformity · §9 Post-market monitoring per Article 72.",
      "Each section has four elements: a plain-English explanation of what the regulator wants, an evidence checklist, a fillable template structure mapped to the Annex IV bullets, and a “common SME pitfall” callout flagging the failure modes most often found in audit. Suggested build is five weeks, from scope and ownership through to running the dossier assembly checklist.",
    ],
    whatsInside: [
      "Annex IV-lite technical documentation skeleton (DOCX) + locked PDF",
      "§4 metrics companion workbook (XLSX) — six sheets",
      "§9 post-market monitoring workbook (XLSX) — six sheets",
      "Tech-doc quickstart (PDF + editable DOCX)",
      "Product README with the five-week build plan",
    ],
    pairsWith: ["ai-system-register", "acceptable-use-policy"],
    icon: "techdoc",
  },
  {
    slug: "90-day-roadmap",
    number: "05",
    title: "90-Day Roadmap",
    format: "PDF / DOCX / XLSX",
    shortDescription:
      "A phased plan: weeks 1–4 inventory and literacy, weeks 5–8 policy and vendor review, weeks 9–13 documentation and oversight design. Owner columns, review checkpoints, realistic internal-hour estimates per phase.",
    productPageHeadline: "A 90-day plan that tells you which weeks you can skip.",
    productPageSubhead:
      "Most AI Act roadmaps assume every obligation applies to you. This one starts by finding out whether they do — then sequences the work that's actually yours, and says so plainly when a week is light.",
    productPageBody: [
      "The hard part of AI Act compliance for an SME isn't the work. It's knowing which work is real. Most organisations using AI are deployers of off-the-shelf tools, not providers of high-risk systems — and the obligations are very different. A plan that treats them the same wastes weeks.",
      "This roadmap gates everything on classification. Weeks 1 to 3 produce an inventory of every AI system you use and a written assessment of your role under the Act. Everything after that is conditional on what those three weeks find. If the answer is “no high-risk systems, no providing activity,” the plan tells you to record the finding and move on — not to manufacture work to fill the calendar.",
      "Reflects the 7 May 2026 Digital Omnibus political agreement, which moved Annex III high-risk obligations to an expected 2 December 2027. We treat that as a planning assumption, not settled law, and tell you to verify it — because the amending regulation isn't adopted yet.",
    ],
    whatsInside: [
      "The roadmap document — executive summary, plan-at-a-glance, fourteen weeks of detail with article-level citations (DOCX + PDF)",
      "Working Excel tracker — one row per week, with owner, status, hour tracking",
      "10-minute Quickstart (PDF + editable DOCX)",
      "Launch kit with the marketing collateral (MD)",
    ],
    pairsWith: ["ai-system-register", "acceptable-use-policy"],
    icon: "roadmap",
  },
  {
    slug: "vendor-due-diligence",
    number: "06",
    title: "Vendor Due Diligence Questionnaire",
    format: "DOCX",
    shortDescription:
      "The questions to send your AI vendors before signing or renewing. Covers Article 16 provider obligations, conformity assessment status, technical documentation availability, post-market monitoring, and incident reporting. Returned answers slot directly into your system register.",
    productPageHeadline: "The questions to ask your AI vendors — before signing.",
    productPageSubhead:
      "A structured questionnaire covering Article 16 provider obligations, conformity assessment status, technical documentation, post-market monitoring, and incident-reporting commitments — returned answers slot directly into the AI System Register.",
    productPageBody: [
      "[PLACEHOLDER] Full product README and launch kit for the Vendor Due Diligence Questionnaire are not yet drafted. The questionnaire itself ships as a single DOCX; long-form copy on this page is summarised pending the v1.0 product README.",
    ],
    whatsInside: ["Vendor Due Diligence Questionnaire (DOCX)"],
    pairsWith: ["ai-system-register"],
    icon: "vendor",
  },
];

export function getDeliverable(slug: string): Deliverable | undefined {
  return DELIVERABLES.find((d) => d.slug === slug);
}

export function deliverableSlugs(): string[] {
  return DELIVERABLES.map((d) => d.slug);
}
