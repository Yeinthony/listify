import * as Location from 'expo-location';

export interface Coords {
  lat: number;
  lng: number;
}

const MAX_AGE_MS = 5 * 60 * 1000;

export type LocationResult =
  | { status: 'granted'; coords: Coords }
  | { status: 'denied' };

export async function requestCurrentCoords(): Promise<LocationResult> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return { status: 'denied' };

  const cached = await Location.getLastKnownPositionAsync({ maxAge: MAX_AGE_MS });
  const location =
    cached ?? (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }));

  return {
    status: 'granted',
    coords: { lat: location.coords.latitude, lng: location.coords.longitude },
  };
}
