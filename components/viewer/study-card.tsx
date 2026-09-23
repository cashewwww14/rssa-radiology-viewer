"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Modality, Priority, Study } from "@/lib/types";

const MODALITY_STYLE: Record<string, string> = {
  MR: "border-purple-500/40 bg-purple-500/15 text-purple-300",
  CT: "border-sky-500/40 bg-sky-500/15 text-sky-300",
  CR: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
  DX: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
  US: "border-amber-500/40 bg-amber-500/15 text-amber-300",
  MG: "border-pink-500/40 bg-pink-500/15 text-pink-300",
  XA: "border-rose-500/40 bg-rose-500/15 text-rose-300",
};

const PRIORITY_STYLE: Record<string, string> = {
  STAT: "border-red-500/40 bg-red-500/15 text-red-300",
  URGENT: "border-amber-500/40 bg-amber-500/15 text-amber-300",
  ROUTINE: "border-zinc-500/40 bg-zinc-500/15 text-zinc-300",
};

export function ModalityBadge({ modality }: { modality: Modality }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-6 w-9 justify-center px-0 font-mono text-[11px] font-bold",
        MODALITY_STYLE[modality]
      )}
    >
      {modality}
    </Badge>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-5 px-1.5 font-mono text-[9px] font-semibold uppercase tracking-wider",
        PRIORITY_STYLE[priority]
      )}
    >
      {priority}
    </Badge>
  );
}

export function StudyCard({
  study,
  selected,
  onSelect,
}: {
  study: Study;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
        selected
          ? "border-primary/60 bg-primary/10"
          : "border-transparent bg-card/40 hover:bg-accent/60"
      )}
    >
      <ModalityBadge modality={study.modality} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-foreground">
            {study.patientName}
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            {study.patientId}
          </span>
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {study.studyDescription}
          <span className="mx-1 opacity-40">·</span>
          {study.bodyPart}
        </p>
        <p className="mt-0.5 font-mono text-[10px] text-muted-foreground/70">
          {study.gender} · {study.age} · {study.seriesCount} series ·{" "}
          {study.imageCount} img
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <PriorityBadge priority={study.priority} />
        <span className="font-mono text-[10px] text-muted-foreground">
          {study.studyTime}
        </span>
      </div>
    </button>
  );
}
