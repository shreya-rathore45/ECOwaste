
export type BinType = 'RECYCLING' | 'COMPOST' | 'LANDFILL' | 'HAZARDOUS' | 'E-WASTE';

export interface WasteAnalysis {
  item: string;
  material?: string;
  binType: BinType;
  confidence: number;
  instructions: string;
  reasoning: string;
  safetyWarning?: string;
  legalDisclaimer?: string;
  isRecyclable: boolean;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  analysis: WasteAnalysis;
  imageUrl: string;
}
