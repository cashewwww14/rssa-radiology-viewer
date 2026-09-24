"use client";

import { create } from "zustand";
import type {
  BrowserMode,
  Format,
  Layout,
  Study,
  Tool,
  ViewportFlag,
  ViewportState,
} from "./types";
import { MOCK_STUDIES } from "./mock-data";

const LAYOUT_SIZE: Record<Layout, number> = {
  "1x1": 1,
  "1x2": 2,
  "2x2": 4,
};

function createViewport(study: Study, index: number): ViewportState {
  return {
    id: index,
    studyId: study.id,
    zoom: 1,
    panX: 0,
    panY: 0,
    windowWidth: study.windowWidth,
    windowCenter: study.windowCenter,
    slice: study.maxSlice > 1 ? Math.max(1, Math.floor(study.maxSlice / 2)) : 1,
    inverted: false,
    flipH: false,
    flipV: false,
  };
}

/**
 * Rebuild the viewport grid whenever the layout changes.
 * Slot 0 always carries the currently selected study; for a 1x2 layout we try
 * to pair the selected study with its "prior" so radiologists can compare
 * current vs. previous side by side. Existing viewport state is preserved
 * per-study so zoom/pan/window levels survive a layout switch.
 */
function buildViewports(
  studies: Study[],
  layout: Layout,
  selectedStudyId: string,
  prev: ViewportState[]
): ViewportState[] {
  const size = LAYOUT_SIZE[layout];
  const primary =
    studies.find((s) => s.id === selectedStudyId) ?? studies[0];

  const assigned: Study[] = [primary];
  const used = new Set<string>([primary.id]);

  // Second slot: prefer the prior study of the selected patient.
  if (size >= 2) {
    const prior = primary.priorStudyId
      ? studies.find((s) => s.id === primary.priorStudyId)
      : undefined;
    const next =
      prior ?? studies.find((s) => !used.has(s.id));
    if (next) {
      assigned.push(next);
      used.add(next.id);
    }
  }

  // Remaining slots: fill with other studies in worklist order.
  for (const s of studies) {
    if (assigned.length >= size) break;
    if (!used.has(s.id)) {
      assigned.push(s);
      used.add(s.id);
    }
  }

  // Fallback: duplicate the primary study if there aren't enough studies.
  while (assigned.length < size) {
    assigned.push(primary);
  }

  return assigned.slice(0, size).map((study, i) => {
    const existing = prev.find((p) => p.studyId === study.id);
    return existing ? { ...existing, id: i } : createViewport(study, i);
  });
}

interface ViewerStore {
  studies: Study[];
  selectedStudyId: string;
  activeViewportIndex: number;
  activeTool: Tool;
  layout: Layout;
  format: Format;
  formatSwitching: boolean;
  browserMode: BrowserMode;
  browserOpen: boolean;
  referenceLines: boolean;
  viewports: ViewportState[];

  selectStudy: (id: string) => void;
  setActiveViewport: (index: number) => void;
  setActiveTool: (tool: Tool) => void;
  setLayout: (layout: Layout) => void;
  setFormat: (format: Format) => void;
  setFormatSwitching: (v: boolean) => void;
  setBrowserMode: (mode: BrowserMode) => void;
  setBrowserOpen: (v: boolean) => void;
  toggleReferenceLines: () => void;
  patchViewport: (index: number, patch: Partial<ViewportState>) => void;
  toggleViewportFlag: (index: number, flag: ViewportFlag) => void;
  resetViewport: (index: number) => void;
  resetAll: () => void;
}

export const useViewerStore = create<ViewerStore>((set) => ({
  studies: MOCK_STUDIES,
  selectedStudyId: MOCK_STUDIES[0].id,
  activeViewportIndex: 0,
  activeTool: "scroll",
  layout: "1x1",
  format: "jpg",
  formatSwitching: false,
  browserMode: "worklist",
  browserOpen: false,
  referenceLines: false,
  viewports: buildViewports(MOCK_STUDIES, "1x1", MOCK_STUDIES[0].id, []),

  selectStudy: (id) =>
    set((state) => {
      const study =
        state.studies.find((s) => s.id === id) ?? state.studies[0];
      const index = state.activeViewportIndex;
      return {
        selectedStudyId: id,
        viewports: state.viewports.map((vp, i) =>
          i === index ? createViewport(study, i) : vp
        ),
      };
    }),

  setActiveViewport: (index) => set({ activeViewportIndex: index }),
  setActiveTool: (tool) => set({ activeTool: tool }),
  setLayout: (layout) =>
    set((state) => ({
      layout,
      activeViewportIndex: 0,
      viewports: buildViewports(
        state.studies,
        layout,
        state.selectedStudyId,
        state.viewports
      ),
    })),
  setFormat: (format) => set({ format }),
  setFormatSwitching: (v) => set({ formatSwitching: v }),
  setBrowserMode: (mode) => set({ browserMode: mode }),
  setBrowserOpen: (v) => set({ browserOpen: v }),
  toggleReferenceLines: () =>
    set((state) => ({ referenceLines: !state.referenceLines })),

  patchViewport: (index, patch) =>
    set((state) => ({
      viewports: state.viewports.map((vp, i) =>
        i === index ? { ...vp, ...patch } : vp
      ),
    })),

  toggleViewportFlag: (index, flag) =>
    set((state) => ({
      viewports: state.viewports.map((vp, i) =>
        i === index ? { ...vp, [flag]: !vp[flag] } : vp
      ),
    })),

  resetViewport: (index) =>
    set((state) => {
      const vp = state.viewports[index];
      if (!vp) return state;
      const study = state.studies.find((s) => s.id === vp.studyId);
      if (!study) return state;
      return {
        viewports: state.viewports.map((v, i) =>
          i === index ? createViewport(study, i) : v
        ),
      };
    }),

  resetAll: () =>
    set((state) => ({
      activeTool: "scroll",
      layout: "1x1",
      activeViewportIndex: 0,
      referenceLines: false,
      viewports: buildViewports(state.studies, "1x1", state.selectedStudyId, []),
    })),
}));
