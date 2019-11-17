export interface Parameter {
  location: string;
  parameter: string;
  date: Date;
  value: number;
  unit: string;
  coordinates: Coordinates;
  country: string;
  city: string;
}
export interface Date {
  utc: string;
  local: string;
}
export interface Coordinates {
  latitude: number;
  longitude: number;
}
export interface Location {
  location: string;
  parameter: string;
  date: Date;
  value: number;
  unit: string;
  coordinates: Coordinates;
  country: string;
  city: string;
}
export interface Date {
  utc: string;
  local: string;
}
export interface Coordinates {
  latitude: number;
  longitude: number;
}
export interface Country {
  id: string;
  name: string;
}