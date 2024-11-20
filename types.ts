export interface PitchPoint {
    x: number; // Relative position (0 to 1)
    y: number; // Pitch offset (-1 to 1)
  }
  
  export interface NoteData {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    selected: boolean;
    pitchPoints: PitchPoint[];
  }