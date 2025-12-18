export interface Location {
  id: string;
  name: string; 
  address: string;
  latitude: number;
  longitude: number;
}

export interface Marker {
  id: string;
  coordinates: {
    latitude: number;
    longitude: number
  },
  title: string;
  snippet: string;
  icon: SharedRefType<'image'> | undefined;
  draggable: boolean
}

export interface ManageLocationsState {
  locations: Location[]
  setLocation: (newLocation: Location) => void
  loadLocations: (setLoading: (loading: boolean) => void) => void
}