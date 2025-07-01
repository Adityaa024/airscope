export interface AQIData {
  idx: number;
  aqi: number;
  dominentpol: string;
  time: {
    s: string;
    tz: string;
    v: number;
  };
  city: {
    name: string;
    geo: [number, number];
    url: string;
  };
  iaqi: {
    pm25?: { v: number };
    pm10?: { v: number };
    no2?: { v: number };
    o3?: { v: number };
    co?: { v: number };
    so2?: { v: number };
    h?: { v: number };
    p?: { v: number };
    t?: { v: number };
    w?: { v: number };
  };
  forecast?: {
    daily: {
      pm25: Array<{ avg: number; day: string; max: number; min: number }>;
      pm10: Array<{ avg: number; day: string; max: number; min: number }>;
    };
  };
}

export interface APIResponse {
  status: string;
  data: AQIData;
}

export interface HealthAdvice {
  level: string;
  description: string;
  recommendations: string[];
  color: string;
  bgColor: string;
  emoji: string;
}

export interface LocationData {
  name: string;
  coordinates: [number, number];
}

// Data.gov.in specific types
export interface DataGovRecord {
  id: string;
  station: string;
  city: string;
  state: string;
  agency: string;
  last_update: string;
  pollutant_id: string;
  pollutant_min: string;
  pollutant_max: string;
  pollutant_avg: string;
  pollutant_unit: string;
  type: string;
}

export interface ProcessedAQIData {
  station: string;
  city: string;
  state: string;
  agency: string;
  lastUpdate: string;
  pollutants: {
    [key: string]: {
      min: number;
      max: number;
      avg: number;
      unit: string;
    };
  };
  aqi: number;
  level: string;
  coordinates?: [number, number];
}

export interface DataGovAPIResponse {
  status: string;
  total: number;
  count: number;
  message: string;
  records: DataGovRecord[];
}