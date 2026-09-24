"use client";

import * as React from "react";
import { useViewerStore } from "@/lib/store";
import { MetadataOverlay } from "./metadata-overlay";
import { cn } from "@/lib/utils";
import type { Tool, ViewportState } from "@/lib/types";

const CURSOR: Record<Tool, string> = {
  pointer: "default",
  pan: "grab",
  zoom: "zoom-in",
  window: "ew-resize",
  scroll: "ns-resize",
};

export function Viewport({
  index,
  viewport,
}: {
  index: number;
  viewport: ViewportState;
}) {
  const studies = useViewerStore((s) => s.studies);
  const activeTool = useViewerStore((s) => s.activeTool);
  const activeViewportIndex = useViewerStore((s) => s.activeViewportIndex);
  const referenceLines = useViewerStore((s) => s.referenceLines);
  const setActiveViewport = useViewerStore((s) => s.setActiveViewport);
  const patchViewport = useViewerStore((s) => s.patchViewport);

  const study = studies.find((s) => s.id === viewport.studyId);
  const isActive = activeViewportIndex === index;
  const [dragging, setDragging] = React.useState(false);

  const dragRef = React.useRef<{
    startX: number;
    startY: number;
    panX: number;
    panY: number;
    ww: number;
    wc: number;
  } | null>(null);

  const touchRef = React.useRef<{
    startX: number;
    startY: number;
    panX: number;
    panY: number;
    ww: number;
    wc: number;
    startZoom: number;
    startDistance: number;
    started: boolean;
  } | null>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setActiveViewport(index);
    if (activeTool === "pan" || activeTool === "window") {
      e.currentTarget.setPointerCapture(e.pointerId);
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        panX: viewport.panX,
        panY: viewport.panY,
        ww: viewport.windowWidth,
        wc: viewport.windowCenter,
      };
      setDragging(true);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;

    if (activeTool === "pan") {
      patchViewport(index, {
        panX: dragRef.current.panX + dx,
        panY: dragRef.current.panY + dy,
      });
    } else if (activeTool === "window") {
      patchViewport(index, {
        windowWidth: Math.max(1, Math.round(dragRef.current.ww + dx * 3)),
        windowCenter: Math.max(
          -1024,
          Math.min(4095, Math.round(dragRef.current.wc + dy * 3))
        ),
      });
    }
  };

  const endDrag = () => {
    dragRef.current = null;
    touchRef.current = null;
    setDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (activeTool === "zoom") {
      const factor = e.deltaY < 0 ? 1.12 : 0.9;
      patchViewport(index, {
        zoom: Math.min(10, Math.max(0.2, viewport.zoom * factor)),
      });
    } else if (activeTool === "scroll" && study && study.maxSlice > 1) {
      const delta = Math.sign(e.deltaY || 1) * Math.max(0.25, Math.abs(e.deltaY) / 900);
      patchViewport(index, {
        slice: Math.min(
          study.maxSlice,
          Math.max(1, viewport.slice + delta)
        ),
      });
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setActiveViewport(index);

    if (e.touches.length === 1) {
      touchRef.current = {
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        panX: viewport.panX,
        panY: viewport.panY,
        ww: viewport.windowWidth,
        wc: viewport.windowCenter,
        startZoom: viewport.zoom,
        startDistance: 0,
        started: true,
      };
      return;
    }

    if (e.touches.length >= 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchRef.current = {
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        panX: viewport.panX,
        panY: viewport.panY,
        ww: viewport.windowWidth,
        wc: viewport.windowCenter,
        startZoom: viewport.zoom,
        startDistance: distance,
        started: true,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchRef.current || !touchRef.current.started) return;

    if (e.touches.length >= 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = distance / Math.max(1, touchRef.current.startDistance || distance);
      patchViewport(index, {
        zoom: Math.min(10, Math.max(0.2, touchRef.current.startZoom * factor)),
      });
      return;
    }

    const touch = e.touches[0];
    const dx = touch.clientX - touchRef.current.startX;
    const dy = touch.clientY - touchRef.current.startY;

    if (activeTool === "pan") {
      patchViewport(index, {
        panX: touchRef.current.panX + dx,
        panY: touchRef.current.panY + dy,
      });
      return;
    }

    if (activeTool === "window") {
      patchViewport(index, {
        windowWidth: Math.max(1, Math.round(touchRef.current.ww + dx * 3)),
        windowCenter: Math.max(
          -1024,
          Math.min(4095, Math.round(touchRef.current.wc + dy * 3))
        ),
      });
      return;
    }

    if (activeTool === "scroll" && study && study.maxSlice > 1) {
      const delta = Math.sign(dy || 1) * Math.max(0.25, Math.abs(dy) / 220);
      patchViewport(index, {
        slice: Math.min(study.maxSlice, Math.max(1, viewport.slice + delta)),
      });
      return;
    }

    if (activeTool === "zoom") {
      const factor = Math.exp((-dy / 220) * 1.6);
      patchViewport(index, {
        zoom: Math.min(10, Math.max(0.2, touchRef.current.startZoom * factor)),
      });
    }
  };

  if (!study) {
    return (
      <div className="relative flex items-center justify-center overflow-hidden bg-black">
        <span className="text-sm text-muted-foreground">Tidak ada studi</span>
      </div>
    );
  }

  const sliceRatio = study.maxSlice > 1 ? (viewport.slice - 1) / (study.maxSlice - 1) : 0;
  const sliceShiftY = study.maxSlice > 1 ? (sliceRatio - 0.5) * 18 : 0;

  const currentSliceIndex = Math.min(
    Math.max(0, Math.round(viewport.slice) - 1),
    Math.max(0, (study.sliceImages?.length ?? 1) - 1)
  );

  const currentImageSrc =
    study.sliceImages?.[currentSliceIndex] ?? study.imageSrc;

  const transform = [
    `translate(${viewport.panX}px, ${viewport.panY + sliceShiftY}px)`,
    `scale(${viewport.zoom})`,
    `scaleX(${viewport.flipH ? -1 : 1})`,
    `scaleY(${viewport.flipV ? -1 : 1})`,
  ].join(" ");

  // Simulate window/level by mapping to CSS brightness & contrast.
  const brightness = Math.max(
    0.4,
    Math.min(2.4, 1 + (viewport.windowCenter - study.windowCenter) / 2200)
  );
  const contrast = Math.max(
    0.4,
    Math.min(2.6, 1 + (viewport.windowWidth - study.windowWidth) / 2200)
  );
  const filter = `${viewport.inverted ? "invert(1)" : ""} brightness(${brightness.toFixed(
    3
  )}) contrast(${contrast.toFixed(3)})`;

  return (
    <div
      className={cn(
        "group relative overflow-hidden bg-black",
        isActive && "ring-2 ring-primary"
      )}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={endDrag}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={endDrag}
      onTouchCancel={endDrag}
      style={{ touchAction: "none" }}
    >
      <img
        src={currentImageSrc}
        alt={study.studyDescription}
        draggable={false}
        className="absolute inset-0 h-full w-full select-none object-contain"
        style={{
          transform,
          transformOrigin: "center",
          filter,
          cursor: dragging ? "grabbing" : CURSOR[activeTool],
          transition: dragging ? "none" : "filter 120ms linear",
        }}
      />

      {/* Reference lines (localizer simulation) */}
      {referenceLines && (
        <div className="pointer-events-none absolute inset-0 z-[5]">
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-primary/70" />
          <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-primary/70" />
          <div className="absolute inset-2 border border-primary/50" />
        </div>
      )}

      {/* Viewport index badge (PACS-style) */}
      <div className="absolute left-1/2 top-2 z-10 -translate-x-1/2 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[10px] text-primary">
        VP{index + 1}
      </div>

      <MetadataOverlay study={study} viewport={viewport} />
    </div>
  );
}
