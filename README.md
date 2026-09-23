# RSSA Radiology Viewer — Mobile-First Radiology Workspace

Antarmuka **"Radiology Viewer Workspace"** untuk **RSUD Dr. Saiful Anwar (RSSA)**, Malang.
Dibangun sebagai UI shell fungsional bergaya PACS (Philips Vue) yang diadaptasi untuk
perangkat **mobile & web**, menjawab masalah utama dokter pengirim: lambatnya akses
citra **DICOM** di jaringan standar.

> **Konteks skripsi:** RSSA saat ini memakai PACS Philips untuk radiolog, terhubung ke
> ±38 modalitas (Philips Digital Diagnost, Siemens Somatom CT, GE Signa MRI, Carestream,
> dsb). Portal ini adalah jembatan untuk **keluarga pasien & dokter pengirim** agar bisa
> melihat hasil radiologi via browser — dengan fallback **JPG** ketika DICOM berat.

---

## ✨ Fitur Inti

- **Study Browser** — sidebar di desktop, *bottom sheet* (swipe-up) di mobile.
  - Data: Nama, ID, tanggal, modalitas, body part, prioritas (STAT/URGENT/ROUTINE).
  - Cari + filter modalitas (MR/CT/CR/US).
  - Mode **"View & Load"** vs **"Archive"** (studi lama / prior).
- **Main Viewer Portal** — area gelap penuh, multi-viewport:
  - Layout **1x1 / 1x2 / 2x2** (bandingkan *prior vs current*).
  - Empat sudut **metadata overlay** (identitas pasien, RSSA+modalitas, zoom/W-L/slice, tanggal-jam).
- **Toolbar manipulasi** (PACS-grade): Pointer, Pan, Zoom, **Windowing (W/L)**, Scroll/Slice,
  Invert, Flip H/V, Garis Referensi, Reset.
- **Toggle DICOM ↔ JPG** (fitur unggulan) — dengan *loading spinner* + *toast notification*.
- State management penuh dengan **Zustand** (tool aktif, layout, viewport, format).

---

## 🛠 Tech Stack

| Lapisan | Teknologi |
|---|---|
| Framework | Next.js 14 (App Router) + React 18 |
| Bahasa | TypeScript |
| Styling | Tailwind CSS (strict dark mode) |
| UI Primitives | Shadcn/ui (new-york) |
| Ikon | Lucide React |
| State | Zustand v5 |
| Toast | Sonner |
| Primitif Radix | switch, dialog/sheet, dropdown, tooltip, slider, scroll-area |

---

## 🚀 Menjalankan

```bash
cd rssa-radiology-viewer
npm install
npm run dev
```

Buka http://localhost:3000

> **Build produksi:** `npm run build` lalu `npm start`.

---

## 📁 Struktur

```
rssa-radiology-viewer/
├── app/
│   ├── layout.tsx            # dark mode, font, metadata
│   ├── page.tsx
│   └── globals.css           # token warna PACS + utilities
├── components/
│   ├── ui/                   # shadcn primitives
│   └── viewer/               # workspace, browser, viewport, toolbar
├── lib/
│   ├── types.ts              # domain types (Study, Viewport, Tool…)
│   ├── mock-data.ts          # worklist RSSA realistis
│   └── store.ts              # Zustand store (tools, layout, format)
└── public/images/            # placeholder radiologi (SVG self-contained)
```

---

## 🧠 Logika State (Zustand)

`lib/store.ts` mengelola seluruh *viewer state*:

- `activeTool` → mengubah kursor & perilaku drag (pan/zoom/window/scroll).
- `layout` → `buildViewports()` menyusun ulang grid; **1x2** otomatis memasangkan
  studi terpilih dengan *prior*-nya untuk perbandingan.
- `format` + `formatSwitching` → menampilkan spinner & toast saat ganti DICOM/JPG.
- `patchViewport` / `toggleViewportFlag` → manipulasi per-viewport (zoom, W/L, slice, flip).

> Windowing disimulasikan lewat mapping **Window Width/Center → CSS brightness/contrast**.

---

## 🔌 Integrasi ke Backend (Langkah Berikutnya)

UI ini sengaja memakai *placeholder*. Untuk produksi, ganti `imageSrc` pada
`lib/mock-data.ts` dengan URL nyata:

1. **JPG ringan** → endpoint SIRS/RIS yang sudah menghasilkan JPG (sesuai kondisi RSSA).
2. **DICOM penuh** → pasang **Cornerstone3D + DICOMweb/WADO-RS** ke PACS Philips.
3. Ganti `useViewerStore` menjadi hasil fetch dari API worklist (DICOM QIDO-RS).

Titik integrasi utama: `lib/store.ts` (sumber data) dan `components/viewer/viewport.tsx`
(rendering citra + interaksi).
