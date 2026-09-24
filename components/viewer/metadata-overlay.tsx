"use client";

import type { Study, ViewportState } from "@/lib/types";

/**
 * Four-corner medical metadata overlay (DICOM-style burnt-in annotations)
 * absolutely positioned over the viewport image.
 */
export function MetadataOverlay({
  study,
  viewport,
}: {
  study: Study;
  viewport: ViewportState;
}) {
  const spacingMm = study.pixelSpacingMm ?? 1;
  const rulerMm = 20;
  const rulerPx = Math.max(48, (rulerMm / spacingMm) / Math.max(0.7, viewport.zoom));

  return (
    <div className="pointer-events-none absolute inset-0 z-10 select-none font-mono text-foreground">
      {/* Top-Left: Patient identity */}
      <div className="absolute left-2 top-2 max-w-[46%] space-y-0.5">
        <p className="pacs-tag max-w-full truncate text-[10px] font-semibold">{study.patientName}</p>
        <p className="pacs-tag max-w-full truncate text-[9px]">
          <span className="pacs-tag-label">ID </span>
          {study.patientId}
          <span className="mx-1 opacity-40">·</span>
          {study.gender}
        </p>
        <p className="pacs-tag max-w-full truncate text-[9px]">
          <span className="pacs-tag-label">DOB </span>
          {study.dob}
          <span className="mx-1 opacity-40">·</span>
          {study.age}
        </p>
      </div>

      {/* Top-Right: Hospital & study description */}
      <div className="absolute right-2 top-2 max-w-[46%] space-y-0.5 text-right">
        <p className="pacs-tag max-w-full truncate text-[10px] font-semibold">RSUD Dr. Saiful Anwar</p>
        <p className="pacs-tag max-w-full truncate text-[9px]">
          {study.modality}
          <span className="mx-1 opacity-40">·</span>
          {study.studyDescription}
        </p>
        <p className="pacs-tag max-w-full truncate text-[9px]">{study.bodyPart}</p>
      </div>

      {/* Bottom-Left: Zoom / Window-Level / Slice */}
      <div className="absolute bottom-2 left-2 space-y-0.5">
        <p className="pacs-tag text-[9px]">
          <span className="pacs-tag-label">Zoom </span>
          {Math.round(viewport.zoom * 100)}%
        </p>
        <p className="pacs-tag text-[9px]">
          <span className="pacs-tag-label">W </span>
          {viewport.windowWidth}
          <span className="mx-1 opacity-40">/</span>
          <span className="pacs-tag-label">L </span>
          {viewport.windowCenter}
        </p>
        {study.maxSlice > 1 && (
          <p className="pacs-tag text-[9px]">
            <span className="pacs-tag-label">Slice </span>
            {viewport.slice}
            <span className="opacity-40">/{study.maxSlice}</span>
          </p>
        )}
      </div>

      {/* Actual scale ruler */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-2 text-[9px] text-foreground/85">
          <span>{rulerMm}mm</span>
          <div className="relative h-2 overflow-hidden rounded-sm bg-foreground/85" style={{ width: `${rulerPx}px` }}>
            <div className="absolute inset-y-0 left-0 w-px bg-foreground" />
            <div className="absolute inset-y-0 right-0 w-px bg-foreground" />
          </div>
        </div>
      </div>

      {/* Bottom-Right: Study date & time */}
      <div className="absolute bottom-2 right-2 space-y-0.5 text-right">
        <p className="pacs-tag text-[10px] font-semibold">{study.studyDate}</p>
        <p className="pacs-tag text-[9px]">{study.studyTime}</p>
      </div>
    </div>
  );
}
