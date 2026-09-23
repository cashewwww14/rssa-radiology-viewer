"use client";

import type { ComponentType } from "react";
import {
  MousePointer2,
  Hand,
  ZoomIn,
  Contrast,
  Layers,
  SunMoon,
  FlipHorizontal2,
  FlipVertical2,
  ScanLine,
  RotateCcw,
  RefreshCw,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { useViewerStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Tool } from "@/lib/types";

interface ToolButtonProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
  disabled?: boolean;
  side?: "top" | "bottom";
  onClick: () => void;
}

function ToolButton({
  icon: Icon,
  label,
  active,
  disabled,
  side = "bottom",
  onClick,
}: ToolButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={label}
          disabled={disabled}
          onClick={onClick}
          className={cn(
            "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-40",
            active &&
              "bg-primary/15 text-primary ring-1 ring-inset ring-primary/40"
          )}
        >
          <Icon className="h-[18px] w-[18px]" />
        </button>
      </TooltipTrigger>
      <TooltipContent side={side}>
        <span className="font-mono text-[11px]">{label}</span>
      </TooltipContent>
    </Tooltip>
  );
}

const ACTIVE_TOOLS: { id: Tool; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { id: "pointer", label: "Pointer / Pilih", icon: MousePointer2 },
  { id: "pan", label: "Pan / Geser", icon: Hand },
  { id: "zoom", label: "Zoom / Perbesar", icon: ZoomIn },
  { id: "window", label: "Windowing (W/L)", icon: Contrast },
  { id: "scroll", label: "Scroll / Slice", icon: Layers },
];

export function ManipulationToolbar({
  side = "bottom",
}: {
  side?: "top" | "bottom";
}) {
  const activeTool = useViewerStore((s) => s.activeTool);
  const setActiveTool = useViewerStore((s) => s.setActiveTool);
  const activeViewportIndex = useViewerStore((s) => s.activeViewportIndex);
  const viewports = useViewerStore((s) => s.viewports);
  const referenceLines = useViewerStore((s) => s.referenceLines);
  const toggleReferenceLines = useViewerStore((s) => s.toggleReferenceLines);
  const toggleViewportFlag = useViewerStore((s) => s.toggleViewportFlag);
  const resetViewport = useViewerStore((s) => s.resetViewport);
  const resetAll = useViewerStore((s) => s.resetAll);

  const vp = viewports[activeViewportIndex];
  const tooltipSide = side === "bottom" ? "top" : "bottom";

  return (
    <div className="flex items-center gap-1 border-border px-2 py-1.5">
      <div className="flex items-center gap-0.5">
        {ACTIVE_TOOLS.map((t) => (
          <ToolButton
            key={t.id}
            icon={t.icon}
            label={t.label}
            side={tooltipSide}
            active={activeTool === t.id}
            onClick={() => setActiveTool(t.id)}
          />
        ))}
      </div>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <div className="flex items-center gap-0.5">
        <ToolButton
          icon={SunMoon}
          label="Invert (Negatif)"
          side={tooltipSide}
          active={vp?.inverted}
          onClick={() => toggleViewportFlag(activeViewportIndex, "inverted")}
        />
        <ToolButton
          icon={FlipHorizontal2}
          label="Flip Horizontal"
          side={tooltipSide}
          active={vp?.flipH}
          onClick={() => toggleViewportFlag(activeViewportIndex, "flipH")}
        />
        <ToolButton
          icon={FlipVertical2}
          label="Flip Vertikal"
          side={tooltipSide}
          active={vp?.flipV}
          onClick={() => toggleViewportFlag(activeViewportIndex, "flipV")}
        />
        <ToolButton
          icon={ScanLine}
          label="Garis Referensi"
          side={tooltipSide}
          active={referenceLines}
          onClick={toggleReferenceLines}
        />
      </div>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <div className="flex items-center gap-0.5">
        <ToolButton
          icon={RotateCcw}
          label="Reset Viewport"
          side={tooltipSide}
          onClick={() => resetViewport(activeViewportIndex)}
        />
        <ToolButton
          icon={RefreshCw}
          label="Reset Semua"
          side={tooltipSide}
          onClick={resetAll}
        />
      </div>
    </div>
  );
}
