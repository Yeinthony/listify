import { ActionDeps } from "@/types/action-deps";

export interface Location {
  id?: string;
  userId: string;
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
}

export type LocationInput = Partial<Pick<Location, 'name' | 'address' | 'latitude' | 'longitude'>>;

export interface Marker {
 latitude: number;
  longitude: number
}

export interface PushLocationParams extends ActionDeps {
  location: Location,
  onSuccess: () => void
}

export interface UpdateLocationParams extends ActionDeps {
  id: string,
  data: LocationInput,
  onSuccess: () => void
}

export interface RemoveLocationParams extends ActionDeps {
  id: string,
  onSuccess?: () => void
}

export interface ManageLocationsState {
  locations: Location[]
  pushLocation: (locationParams: PushLocationParams) => void
  updateLocation: (params: UpdateLocationParams) => void
  removeLocation: (params: RemoveLocationParams) => void
  loadLocations: (setLoading: (loading: boolean) => void) => void
}