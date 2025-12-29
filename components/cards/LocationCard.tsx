import { Location } from "@/store/types/manage-location.store"
import { HStack } from "../ui/hstack"
import MapView, { Marker } from "react-native-maps"
import { View } from "react-native"
import { VStack } from "../ui/vstack"
import { Text } from "../ui/text"
import { Heading } from "../ui/heading"

const LocationCard = ({location}: {location: Location}) => {
  return (
    <HStack 
      className="w-full bg-background-0 p-3 rounded-lg"
      space="md"
    >
      <View
        style={{
          width: '35%',
          height: 70,
        }}
        className="rounded-md overflow-hidden"
      >
        <MapView
          style={{
            flex: 1
          }}
          camera={{
            center: {
              latitude: location.latitude,
              longitude: location.longitude
            },
            zoom: 15,
            heading: 0,
            pitch: 0
          }}
          zoomEnabled={false}
          zoomTapEnabled={false}
          scrollEnabled={false}
        >
          <Marker 
            coordinate={
              location
            }
            image={require('@/assets/images/favorite-pin-small.png')}
            
          />
        </MapView>
      </View>
      <VStack className="justify-between">
        <HStack>
          <Heading className="font-medium text-xl">
            {location.name}
          </Heading>
        </HStack>
        <VStack>
          <Text className="font-light text-typography-700 text-sm">
            Latitud: {location.longitude}
          </Text>
          <Text className="font-light text-typography-700 text-sm">
            Longitud: {location.longitude}
          </Text>
        </VStack>
      </VStack>
    </HStack>
  )
}

export default LocationCard