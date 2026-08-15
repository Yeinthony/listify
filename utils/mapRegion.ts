import type { Region } from "react-native-maps";

const KM_PER_LATITUDE_DEGREE = 111;
const DIAMETER_WITH_MARGIN = 2.6;

export const MIN_REGION_SCALE = 0.05;
export const MAX_REGION_SCALE = 8;
export const REGION_SCALE_STEP = 1.6;

export const regionForKm = (
  latitude: number,
  longitude: number,
  km: number,
  scale: number = 1
): Region => {
  const delta = (km * DIAMETER_WITH_MARGIN * scale) / KM_PER_LATITUDE_DEGREE;

  return {
    latitude,
    longitude,
    latitudeDelta: delta,
    longitudeDelta: delta
  };
};

export const zoomInScale = (scale: number) =>
  Math.max(scale / REGION_SCALE_STEP, MIN_REGION_SCALE);

export const zoomOutScale = (scale: number) =>
  Math.min(scale * REGION_SCALE_STEP, MAX_REGION_SCALE);
