export type ViewMode = 'proposed' | 'original' | 'renovation_overlay' | '3d_view' | 'gallery_renders';

export type RoomId = 
  | 'lounge' 
  | 'kitchen_old' 
  | 'bathroom_main' 
  | 'kitchen_new' 
  | 'master_suite' 
  | 'kids_room' 
  | 'balcony' 
  | 'shaft_1' 
  | 'shaft_2' 
  | 'corridor';

export interface FurnitureItem {
  id: string;
  name: string;
  arabicName: string;
  dimensions: string; // e.g. "1.80m x 0.90m"
  iconType: string;
  x: number; // percentage or scale coordinate in 2D
  y: number;
  width: number;
  height: number;
  rotation?: number;
  category: 'living' | 'dining' | 'bedroom' | 'kitchen' | 'bathroom' | 'storage' | 'decor';
  notes?: string;
  isCustomRequested?: boolean;
}

export interface RoomData {
  id: RoomId;
  name: string;
  arabicName: string;
  originalName: string;
  originalRole: string;
  proposedRole: string;
  dimensionsOriginal: { width: number; length: number; area: number }; // meters
  dimensionsProposed: { width: number; length: number; area: number };
  description: string;
  furniture: FurnitureItem[];
  architecturalNotes: string[];
  plumbingNotes?: string;
  ventilationSource: 'منور 1' | 'منور 2' | 'بلكونة' | 'واجهة' | 'ممر داخلي';
  colorTheme: string;
  lightingPlan: string[];
  acLocation?: string;
}

export interface WallSegment {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  type: 'exterior' | 'load_bearing' | 'interior_retained' | 'to_demolish' | 'to_build';
  label?: string;
}

export interface PlumbingPath {
  id: string;
  name: string;
  type: 'drainage' | 'supply' | 'gas';
  color: string;
  points: { x: number; y: number }[];
  targetShaft: 'منور 1' | 'منور 2';
  description: string;
}

export interface CostItem {
  id: string;
  category: string;
  item: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  total: number;
  notes: string;
}
