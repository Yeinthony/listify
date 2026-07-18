import { AddressSuggestion, LocationIQResult } from './types/geocoding';

const KEY = process.env.EXPO_PUBLIC_LOCATIONIQ_KEY;
const AUTOCOMPLETE_URL = 'https://api.locationiq.com/v1/autocomplete';
const SEARCH_URL = 'https://us1.locationiq.com/v1/search';
const REVERSE_URL = 'https://us1.locationiq.com/v1/reverse';

const toSuggestion = (r: LocationIQResult): AddressSuggestion => {
  const commaIndex = r.display_name.indexOf(',');
  const fallbackTitle = commaIndex === -1 ? r.display_name : r.display_name.slice(0, commaIndex);
  const fallbackSubtitle = commaIndex === -1 ? '' : r.display_name.slice(commaIndex + 1).trim();

  return {
    placeId: r.place_id,
    title: r.display_place || fallbackTitle,
    subtitle: r.display_address || fallbackSubtitle,
    label: r.display_name,
    latitude: parseFloat(r.lat),
    longitude: parseFloat(r.lon),
  };
};

const fetchResults = async (url: string, signal?: AbortSignal): Promise<Response> =>
  fetch(url, { signal, headers: { Accept: 'application/json' } });

export const autocompleteAddress = async (
  query: string,
  signal?: AbortSignal,
): Promise<AddressSuggestion[]> => {
  const q = query.trim();
  if (!KEY || q.length < 3) return [];

  const params = new URLSearchParams({
    key: KEY,
    q,
    limit: '5',
    countrycodes: 'ar',
    'accept-language': 'es',
    normalizecity: '1',
  });

  try {
    let res = await fetchResults(`${AUTOCOMPLETE_URL}?${params.toString()}`, signal);

    if (res.status === 401 || res.status === 403) {
      const searchParams = new URLSearchParams({
        key: KEY,
        q,
        format: 'json',
        addressdetails: '1',
        limit: '5',
        countrycodes: 'ar',
        'accept-language': 'es',
      });
      res = await fetchResults(`${SEARCH_URL}?${searchParams.toString()}`, signal);
    }

    if (!res.ok) return [];

    const data = (await res.json()) as LocationIQResult[];
    if (!Array.isArray(data)) return [];
    return data.map(toSuggestion);
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') throw err;
    return [];
  }
};

export const reverseGeocode = async (
  lat: number,
  lon: number,
  signal?: AbortSignal,
): Promise<AddressSuggestion | null> => {
  if (!KEY) return null;

  const params = new URLSearchParams({
    key: KEY,
    lat: `${lat}`,
    lon: `${lon}`,
    format: 'json',
    'accept-language': 'es',
    normalizeaddress: '1',
  });

  try {
    const res = await fetchResults(`${REVERSE_URL}?${params.toString()}`, signal);
    if (!res.ok) return null;

    const data = (await res.json()) as LocationIQResult;
    if (!data || !data.lat) return null;
    return toSuggestion(data);
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') throw err;
    return null;
  }
};
