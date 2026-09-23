"use client";

import { FileImage, Database } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useViewerStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Format } from "@/lib/types";

export function DicomJpgToggle() {
  const format = useViewerStore((s) => s.format);
  const setFormat = useViewerStore((s) => s.setFormat);
  const setFormatSwitching = useViewerStore((s) => s.setFormatSwitching);

  const handleToggle = (checked: boolean) => {
    const next: Format = checked ? "dicom" : "jpg";
    if (next === format) return;

    setFormatSwitching(true);
    const loadingId = toast.loading(
      next === "dicom"
        ? "Beralih ke DICOM asli (WADO)…"
        : "Beralih ke JPG ringan…"
    );

    window.setTimeout(() => {
      setFormat(next);
      setFormatSwitching(false);
      toast.success(
        next === "dicom"
          ? "Mode DICOM aktif — lossless, resolusi penuh"
          : "Mode JPG aktif — ringan & cepat di jaringan",
        { id: loadingId }
      );
    }, 900);
  };

  const isDicom = format === "dicom";

  return (
    <div
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-lg border px-2 py-1 sm:px-2.5 sm:py-1.5",
        isDicom
          ? "border-primary/50 bg-primary/10"
          : "border-input bg-background/40"
      )}
      title="Ubah format rendering (DICOM vs JPG)"
    >
      <span
        className={cn(
          "flex items-center gap-1 text-[9px] font-medium uppercase tracking-wide sm:text-[11px]",
          !isDicom ? "text-primary" : "text-muted-foreground"
        )}
      >
        <FileImage className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        JPG
      </span>
      <Switch
        checked={isDicom}
        onCheckedChange={handleToggle}
        aria-label="Toggle format DICOM/JPG"
      />
      <span
        className={cn(
          "flex items-center gap-1 text-[9px] font-medium uppercase tracking-wide sm:text-[11px]",
          isDicom ? "text-primary" : "text-muted-foreground"
        )}
      >
        <Database className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        DICOM
      </span>
    </div>
  );
}
