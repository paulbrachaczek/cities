export interface Results {
  location: string;
  city: string;
  country: string;
  distance?: number | null;
  measurements?: (MeasurementsEntity)[] | null;
  coordinates?: Coordinates | null;
}
export interface MeasurementsEntity {
  parameter: string;
  value: number;
  lastUpdated: string;
  unit: string;
  sourceName: string;
  averagingPeriod?: AveragingPeriod | null;
}
export interface AveragingPeriod {
  value: number;
  unit: string;
}
export interface Coordinates {
  latitude: number;
  longitude: number;
}
export interface Zawartość odpowiedzi {
  EDITOR_CONFIG: EDITORCONFIG;
}
export interface EDITORCONFIG {
  text: string;
  mode: string;
}
