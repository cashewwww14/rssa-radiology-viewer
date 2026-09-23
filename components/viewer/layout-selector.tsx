"use client";

import { useViewerStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Layout } from "@/lib/types";

const OPTIONS: { value: Layout; label: string }[] = [
  { value: "1x1", label: "1x1" },
  { value: "1x2", label: "1x2" },
  { value: "2x2", label: "2x2" },
];

function LayoutPreview({ layout }: { layout: Layout }) {
  return (
    <span
      className={cn(
        "grid h-4 w-4 gap-px",
        layout === "1x1" && "grid-cols-1 grid-rows-1",
        layout === "1x2" && "grid-cols-2 grid-rows-1",
        layout === "2x2" && "grid-cols-2 grid-rows-2"
      )}
    >
      {Array.from({ length: layout === "2x2" ? 4 : layout === "1x2" ? 2 : 1 }).map(
        (_, i) => (
          <span key={i} className="rounded-[2px] border border-current" />
        )
      )}
    </span>
  );
}

export function LayoutSelector() {
  const layout = useViewerStore((s) => s.layout);
  const setLayout = useViewerStore((s) => s.setLayout);

  return (
    <div
      role="group"
      aria-label="Layout viewport"
      className="flex shrink-0 items-center gap-0.5 rounded-lg border border-input bg-background/40 p-0.5"
    >
      {OPTIONS.map((opt) => {
        const active = layout === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-label={`Layout ${opt.label}`}
            aria-pressed={active}
            title={`Layout ${opt.label}`}
            onClick={() => setLayout(opt.value)}
            className={cn(
              "flex items-center gap-1 rounded-md px-1.5 py-1 text-[10px] font-medium transition-colors sm:px-2 sm:text-xs",
              active
                ? "bg-primary/15 text-primary ring-1 ring-inset ring-primary/40"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <LayoutPreview layout={opt.value} />
            <span className="font-mono">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
