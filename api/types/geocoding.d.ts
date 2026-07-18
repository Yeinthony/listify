export interface LocationIQResult {
  place_id: string;
  lat: string;
  lon: string;
  display_name: string;
  display_place?: string;
  display_address?: string;
  class?: string;
  type?: string;
}

export interface AddressSuggestion {
  placeId: string;
  title: string;
  subtitle: string;
  label: string;
  latitude: number;
  longitude: number;
}
