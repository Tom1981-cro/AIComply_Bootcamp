import {
  GraduationCap,
  Table2,
  FileText,
  FileCheck2,
  Map,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";
import type { DeliverableIcon as IconKey } from "@/lib/deliverables";

const ICONS: Record<IconKey, LucideIcon> = {
  literacy: GraduationCap,
  register: Table2,
  aup: FileText,
  techdoc: FileCheck2,
  roadmap: Map,
  vendor: ClipboardList,
};

export function DeliverableIcon({
  name,
  className,
}: {
  name: IconKey;
  className?: string;
}) {
  const Icon = ICONS[name];
  return <Icon className={className} aria-hidden />;
}
