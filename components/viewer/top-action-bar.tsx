"use client";

import { Activity, MoreVertical, Menu, List, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useViewerStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { DicomJpgToggle } from "./dicom-jpg-toggle";
import { LayoutSelector } from "./layout-selector";

export function TopActionBar() {
  const browserMode = useViewerStore((s) => s.browserMode);
  const setBrowserMode = useViewerStore((s) => s.setBrowserMode);
  const setBrowserOpen = useViewerStore((s) => s.setBrowserOpen);
  const resetViewport = useViewerStore((s) => s.resetViewport);
  const resetAll = useViewerStore((s) => s.resetAll);
  const activeViewportIndex = useViewerStore((s) => s.activeViewportIndex);

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-card/50 px-3 backdrop-blur">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        aria-label="Buka daftar studi"
        onClick={() => setBrowserOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Brand */}
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-inset ring-primary/40">
          <Activity className="h-4 w-4 text-primary" />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-tight">
            RSSA <span className="text-primary">Viewer</span>
          </p>
          <p className="hidden font-mono text-[9px] uppercase tracking-widest text-muted-foreground sm:block">
            Mobile Radiology Workspace
          </p>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* View & Load / Archive toggle (desktop) */}
        <div
          role="group"
          aria-label="Mode daftar studi"
          className="hidden items-center gap-0.5 rounded-lg border border-input bg-background/40 p-0.5 sm:flex"
        >
          <button
            type="button"
            onClick={() => setBrowserMode("worklist")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium transition-colors",
              browserMode === "worklist"
                ? "bg-primary/15 text-primary ring-1 ring-inset ring-primary/40"
                : "text-muted-foreground hover:bg-accent"
            )}
          >
            <List className="h-3.5 w-3.5" />
            View &amp; Load
          </button>
          <button
            type="button"
            onClick={() => setBrowserMode("archive")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium transition-colors",
              browserMode === "archive"
                ? "bg-primary/15 text-primary ring-1 ring-inset ring-primary/40"
                : "text-muted-foreground hover:bg-accent"
            )}
          >
            <Archive className="h-3.5 w-3.5" />
            Archive
          </button>
        </div>

        <DicomJpgToggle />
        <LayoutSelector />

        {/* More menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Menu lainnya">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => resetViewport(activeViewportIndex)}>
              Reset viewport aktif
            </DropdownMenuItem>
            <DropdownMenuItem onClick={resetAll}>
              Reset seluruh workspace
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>About</DropdownMenuLabel>
            <DropdownMenuItem disabled>
              RSSA Radiology Portal v0.1
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
