export type Modality = "MR" | "CT" | "CR" | "DX" | "US" | "MG" | "XA";

export type Priority = "STAT" | "URGENT" | "ROUTINE";

export type Tool = "pointer" | "pan" | "zoom" | "window" | "scroll";

export type ViewportFlag = "inverted" | "flipH" | "flipV";

export type Layout = "1x1" | "1x2" | "2x2";

export type Format = "dicom" | "jpg";

export type BrowserMode = "worklist" | "archive";

export type ImageType = "xray" | "mri" | "ct" | "usg";

export interface Study {
  id: string;
  patientName: string;
  patientId: string;
  gender: "L" | "P";
  dob: string;
  age: string;
  modality: Modality;
  bodyPart: string;
  studyDescription: string;
  studyDate: string;
  studyTime: string;
  priority: Priority;
  accessionNumber: string;
  institution: string;
  referringPhysician: string;
  seriesCount: number;
  imageCount: number;
  imageSrc: string;
  sliceImages?: string[];
  imageType: ImageType;
  windowWidth: number;
  windowCenter: number;
  maxSlice: number;
  pixelSpacingMm?: number;
  sliceThicknessMm?: number;
  /** Prior study of the same patient (used for side-by-side comparison) */
  priorStudyId?: string;
  /** Archived / historical studies live in the Archive browser mode */
  archived?: boolean;
}

export interface ViewportState {
  id: number;
  studyId: string;
  zoom: number;
  panX: number;
  panY: number;
  windowWidth: number;
  windowCenter: number;
  slice: number;
  inverted: boolean;
  flipH: boolean;
  flipV: boolean;
}
