"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useViewerStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { StudyCard } from "./study-card";
import type { Modality } from "@/lib/types";

const ALL_MODALITIES: Modality[] = ["MR", "CT", "CR", "US"];

export function StudyBrowser({ onSelect }: { onSelect?: () => void }) {
  const studies = useViewerStore((s) => s.studies);
  const selectedStudyId = useViewerStore((s) => s.selectedStudyId);
  const browserMode = useViewerStore((s) => s.browserMode);
  const setBrowserMode = useViewerStore((s) => s.setBrowserMode);
  const selectStudy = useViewerStore((s) => s.selectStudy);

  const [query, setQuery] = React.useState("");
  const [modality, setModality] = React.useState<Modality | "ALL">("ALL");

  const filtered = studies.filter((s) => {
    if (browserMode === "worklist" && s.archived) return false;
    if (browserMode === "archive" && !s.archived) return false;
    if (modality !== "ALL" && s.modality !== modality) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      s.patientName.toLowerCase().includes(q) ||
      s.patientId.toLowerCase().includes(q) ||
      s.studyDescription.toLowerCase().includes(q) ||
      s.bodyPart.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex h-full w-full flex-col">
      {/* Mode toggle (View & Load / Archive) */}
      <div className="grid grid-cols-2 gap-1 border-b border-border p-2">
        {(["worklist", "archive"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setBrowserMode(mode)}
            className={cn(
              "rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
              browserMode === mode
                ? "bg-primary/15 text-primary ring-1 ring-inset ring-primary/40"
                : "text-muted-foreground hover:bg-accent"
            )}
          >
            {mode === "worklist" ? "View & Load" : "Archive"}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="border-b border-border p-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari pasien / ID / deskripsi…"
            className="h-8 pl-8 text-sm"
          />
        </div>

        {/* Modality filter chips */}
        <div className="mt-2 flex flex-wrap gap-1">
          <FilterChip
            active={modality === "ALL"}
            onClick={() => setModality("ALL")}
            label="Semua"
          />
          {ALL_MODALITIES.map((m) => (
            <FilterChip
              key={m}
              active={modality === m}
              onClick={() => setModality(m)}
              label={m}
            />
          ))}
        </div>
      </div>

      {/* List */}
      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-1 p-2">
          <p className="px-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {filtered.length} studi
          </p>
          {filtered.length === 0 && (
            <p className="px-1 py-8 text-center text-sm text-muted-foreground">
              Tidak ada studi ditemukan.
            </p>
          )}
          {filtered.map((s) => (
            <StudyCard
              key={s.id}
              study={s}
              selected={s.id === selectedStudyId}
              onSelect={() => {
                selectStudy(s.id);
                onSelect?.();
              }}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <Badge
      variant="outline"
      onClick={onClick}
      className={cn(
        "h-6 cursor-pointer select-none px-2 font-mono text-[10px] font-medium",
        active
          ? "border-primary/60 bg-primary/15 text-primary"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {label}
    </Badge>
  );
}
