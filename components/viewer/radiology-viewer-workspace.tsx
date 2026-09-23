"use client";

import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useViewerStore } from "@/lib/store";
import { TopActionBar } from "./top-action-bar";
import { ManipulationToolbar } from "./manipulation-toolbar";
import { ViewerPortal } from "./viewer-portal";
import { StudyBrowser } from "./study-browser";

export function RadiologyViewerWorkspace() {
  const browserOpen = useViewerStore((s) => s.browserOpen);
  const setBrowserOpen = useViewerStore((s) => s.setBrowserOpen);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex h-dvh w-full flex-col overflow-hidden bg-background text-foreground">
        <TopActionBar />

        <div className="flex min-h-0 flex-1">
          {/* Desktop sidebar: Study Browser */}
          <aside className="hidden w-80 shrink-0 border-r border-border bg-card/30 lg:flex">
            <StudyBrowser />
          </aside>

          {/* Main viewer column */}
          <div className="flex min-w-0 flex-1 flex-col">
            {/* Manipulation toolbar: top on desktop */}
            <div className="hidden border-b border-border bg-card/30 lg:block">
              <ManipulationToolbar side="top" />
            </div>

            <ViewerPortal />

            {/* Manipulation toolbar: bottom on mobile */}
            <div className="border-t border-border bg-card/60 backdrop-blur lg:hidden">
              <ManipulationToolbar side="bottom" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: swipe-up bottom sheet for study list */}
      <Sheet open={browserOpen} onOpenChange={setBrowserOpen}>
        <SheetContent side="bottom" className="flex h-[78vh] flex-col p-0">
          <SheetHeader className="shrink-0 border-b border-border p-3 text-left">
            <SheetTitle className="text-base">Daftar Studi</SheetTitle>
            <SheetDescription className="text-xs">
              Pilih studi untuk dimuat ke viewport aktif.
            </SheetDescription>
          </SheetHeader>
          <div className="min-h-0 flex-1">
            <StudyBrowser onSelect={() => setBrowserOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <Toaster theme="dark" position="bottom-center" richColors />
    </TooltipProvider>
  );
}
