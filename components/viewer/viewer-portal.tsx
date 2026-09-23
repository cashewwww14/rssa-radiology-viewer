"use client";

import { Loader2 } from "lucide-react";
import { useViewerStore } from "@/lib/store";
import { Viewport } from "./viewport";
import type { Format, Layout } from "@/lib/types";

const GRID_CLASS: Record<Layout, string> = {
  "1x1": "grid-cols-1 grid-rows-1",
  "1x2": "grid-cols-2 grid-rows-1",
  "2x2": "grid-cols-2 grid-rows-2",
};

const FORMAT_LABEL: Record<Format, string> = {
  dicom: "Memuat DICOM asli…",
  jpg: "Memuat JPG ringan…",
};

export function ViewerPortal() {
  const viewports = useViewerStore((s) => s.viewports);
  const layout = useViewerStore((s) => s.layout);
  const format = useViewerStore((s) => s.format);
  const formatSwitching = useViewerStore((s) => s.formatSwitching);

  return (
    <div className="relative min-h-0 flex-1 overflow-hidden bg-black">
      <div className={`grid h-full w-full gap-1 p-1 ${GRID_CLASS[layout]}`}>
        {viewports.map((vp, i) => (
          <Viewport key={`${layout}-${i}`} index={i} viewport={vp} />
        ))}
      </div>

      {/* Format switch loading overlay */}
      {formatSwitching && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-black/70 backdrop-blur-sm">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="font-mono text-sm text-foreground/90">
            {FORMAT_LABEL[format]}
          </p>
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            {format === "dicom" ? "WADO · Lossless" : "JPEG Baseline · Ringan"}
          </p>
        </div>
      )}
    </div>
  );
}
