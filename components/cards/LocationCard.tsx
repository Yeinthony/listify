import { Location } from "@/store/types/manage-location.store"
import { HStack } from "../ui/hstack"
import { VStack } from "../ui/vstack"
import { View, TouchableOpacity } from "react-native"
import { Text } from "../ui/text"
import { Heading } from "../ui/heading"
import { Menu, MenuItem, MenuItemLabel } from "../ui/menu"
import MapView, { Marker } from "react-native-maps"
import Ionicons from "@expo/vector-icons/Ionicons"
import { useTranslation } from "react-i18next"

interface LocationCardProps {
  location: Location
  onEdit: (location: Location) => void
  onDelete: (location: Location) => void
}

const LocationCard = ({ location, onEdit, onDelete }: LocationCardProps) => {
  const { t } = useTranslation()

  const subtitle = location.address
    ? location.address
    : `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`

  return (
    <HStack
      className="w-full items-center bg-background-0 rounded-2xl p-3"
      space="md"
      style={{ borderCurve: 'continuous' }}
    >
      <View className="h-16 w-16 rounded-xl overflow-hidden">
        <MapView
          style={{ flex: 1 }}
          camera={{
            center: {
              latitude: location.latitude,
              longitude: location.longitude,
            },
            zoom: 15,
            heading: 0,
            pitch: 0,
          }}
          zoomEnabled={false}
          zoomTapEnabled={false}
          scrollEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
        >
          <Marker
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            image={require('@/assets/images/favorite-pin-small.png')}
          />
        </MapView>
      </View>
      <VStack className="flex-1">
        <Heading className="font-medium text-base" numberOfLines={1}>
          {location.name}
        </Heading>
        <Text className="text-sm text-typography-500" numberOfLines={2}>
          {subtitle}
        </Text>
      </VStack>
      <Menu
        placement="bottom right"
        offset={5}
        trigger={({ ...triggerProps }) => (
          <TouchableOpacity {...triggerProps} className="p-1">
            <Ionicons name="ellipsis-vertical" size={20} color="#9ca3af" />
          </TouchableOpacity>
        )}
      >
        <MenuItem key="edit" textValue="edit" onPress={() => onEdit(location)}>
          <Ionicons name="create-outline" size={16} color="#6b7280" />
          <MenuItemLabel size="sm" className="ml-2">{t('screen.manage-locations.edit')}</MenuItemLabel>
        </MenuItem>
        <MenuItem key="delete" textValue="delete" onPress={() => onDelete(location)}>
          <Ionicons name="trash-outline" size={16} color="#e63535" />
          <MenuItemLabel size="sm" className="ml-2 text-error-600">{t('screen.manage-locations.delete')}</MenuItemLabel>
        </MenuItem>
      </Menu>
    </HStack>
  )
}

export default LocationCard
