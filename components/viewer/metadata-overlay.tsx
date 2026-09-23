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
  return (
    <div className="pointer-events-none absolute inset-0 z-10 select-none font-mono text-foreground">
      {/* Top-Left: Patient identity */}
      <div className="absolute left-2 top-2 space-y-0.5">
        <p className="pacs-tag text-xs font-semibold">{study.patientName}</p>
        <p className="pacs-tag">
          <span className="pacs-tag-label">ID </span>
          {study.patientId}
          <span className="mx-1 opacity-40">·</span>
          {study.gender}
        </p>
        <p className="pacs-tag">
          <span className="pacs-tag-label">DOB </span>
          {study.dob}
          <span className="mx-1 opacity-40">·</span>
          {study.age}
        </p>
      </div>

      {/* Top-Right: Hospital & study description */}
      <div className="absolute right-2 top-2 space-y-0.5 text-right">
        <p className="pacs-tag text-xs font-semibold">
          RSUD Dr. Saiful Anwar
        </p>
        <p className="pacs-tag">
          {study.modality}
          <span className="mx-1 opacity-40">·</span>
          {study.studyDescription}
        </p>
        <p className="pacs-tag">{study.bodyPart}</p>
      </div>

      {/* Bottom-Left: Zoom / Window-Level / Slice */}
      <div className="absolute bottom-2 left-2 space-y-0.5">
        <p className="pacs-tag">
          <span className="pacs-tag-label">Zoom </span>
          {Math.round(viewport.zoom * 100)}%
        </p>
        <p className="pacs-tag">
          <span className="pacs-tag-label">W </span>
          {viewport.windowWidth}
          <span className="mx-1 opacity-40">/</span>
          <span className="pacs-tag-label">L </span>
          {viewport.windowCenter}
        </p>
        {study.maxSlice > 1 && (
          <p className="pacs-tag">
            <span className="pacs-tag-label">Slice </span>
            {viewport.slice}
            <span className="opacity-40">/{study.maxSlice}</span>
          </p>
        )}
      </div>

      {/* Bottom-Right: Study date & time */}
      <div className="absolute bottom-2 right-2 space-y-0.5 text-right">
        <p className="pacs-tag text-xs font-semibold">{study.studyDate}</p>
        <p className="pacs-tag">{study.studyTime}</p>
      </div>
    </div>
  );
}
