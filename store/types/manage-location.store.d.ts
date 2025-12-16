export interface Location {
  id: string;
  name: string; 
  address: string;
  latitude: number;
  longitude: number;
}

export interface ManageLocationsState {
  locations: Location[]
  setLocation: (newLocation: Location) => void
  loadLocations: (setLoading: (loading: boolean) => void) => void
}