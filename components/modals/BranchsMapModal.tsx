import {
  Modal,
  ModalBackdrop,
  ModalContent,
} from "@/components/ui/modal";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { BranchsMapModalProps } from "./types/branchs-map";
import { StyleSheet, useColorScheme } from "react-native";
import { TouchableOpacity } from "react-native";
import { VStack } from "../ui/vstack";
import { HStack } from "../ui/hstack";
import { useBranchsMapModal } from "./hooks/useBranchsMapModal";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Center } from "../ui/center";
import { SafeAreaView } from "react-native-safe-area-context";
import { Menu, MenuItem, MenuItemLabel } from "../ui/menu";
import { OriginLocationMenu } from "./OriginLocationMenu";
import { AddLocationModal } from "./AddLocationMapModal";
import MapView, { Circle, Marker } from "react-native-maps";

export const BranchsMapModal = ({ isOpen, onClose, location, availableStores, product }: BranchsMapModalProps) => {
  const colorScheme = useColorScheme();
  const {
    t,
    insets,
    origin,
    mapRef,
    region,
    distance,
    distances,
    storesId,
    selectedStoresName,
    markersbranches,
    savedLocations,
    selectedId,
    originName,
    showAddLocationModal,
    pushStoresId,
    setDistance,
    zoomOn,
    zoomOut,
    centerOnCurrentLocation,
    loadBranchesByLocation,
    handleCloseMenuStore,
    selectLocation,
    selectMyLocation,
    openAddLocation,
    closeAddLocation
  } = useBranchsMapModal({ isOpen, location, availableStores, ean: product.ean });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalBackdrop />
      <ModalContent className="flex-1 border-0 p-0">
        <MapView
          ref={mapRef}
          style={[
            StyleSheet.absoluteFill,
            { bottom: insets.bottom }
          ]}
          initialRegion={region}
          mapPadding={{ left: 15, right: 0, top: 0, bottom: 105 }}
          showsUserLocation={true}
          showsMyLocationButton={false}
          zoomControlEnabled={false}
          toolbarEnabled={false}
        >
          {markersbranches.map(marker => (
            <Marker
              key={marker.id}
              coordinate={marker.coordinate}
              title={marker.title}
              description={marker.description}
              image={marker.image}
            />
          ))}
          <Circle
            center={{
              latitude: origin.lat,
              longitude: origin.lng,
            }}
            radius={distance * 1000}
            fillColor='rgba(228, 75, 94, 0.1)'
            strokeColor='#e44b5e'
            strokeWidth={2}
          />
        </MapView>
        <SafeAreaView className="flex-1" pointerEvents="box-none">
          <HStack space="md" className="items-start mx-4">
            <TouchableOpacity
              onPress={onClose}
              className="bg-background-0 p-2 rounded-xl"
            >
              <Ionicons
                name="chevron-back"
                size={20}
                color={colorScheme === "dark" ? "white" : "black"}
              />
            </TouchableOpacity>
            <Center className="bg-background-0/90 rounded-xl px-4 py-2 flex-1">
              <Heading size="xs" className="flex-1 uppercase">
                {product.name}
              </Heading>
            </Center>
          </HStack>
          <VStack className="flex-1 relative">
            <VStack
              className="absolute right-3"
              style={{
                top: '50%',
                transform: [{ translateY: -66 }]
              }}
              space="sm"
            >
              <TouchableOpacity onPress={zoomOn}>
                <Center className="bg-background-0/90 rounded-full w-11 h-11">
                  <Ionicons
                    name="add"
                    size={22}
                    color="black"
                  />
                </Center>
              </TouchableOpacity>
              <TouchableOpacity onPress={zoomOut}>
                <Center className="bg-background-0/90 rounded-full w-11 h-11">
                  <Ionicons
                    name="remove"
                    size={22}
                    color="black"
                  />
                </Center>
              </TouchableOpacity>
              <TouchableOpacity onPress={centerOnCurrentLocation}>
                <Center className="bg-background-0/90 rounded-full w-11 h-11">
                  <Ionicons
                    name="locate-outline"
                    size={22}
                    color="black"
                  />
                </Center>
              </TouchableOpacity>
            </VStack>
          </VStack>
          <VStack
            className='w-[90%] bg-background-0/90 mx-auto mb-8 px-4 py-3 rounded-2xl'
            space='md'
          >
            <HStack className="items-center flex-wrap" space="sm">
              <HStack
                space="sm"
                className="items-center"
              >
                <Text className='text-md text-typography-600'>
                  Sucursales a
                </Text>
                <Menu
                  placement="top"
                  className='mb-14'
                  offset={5}
                  closeOnSelect={true}
                  trigger={({ ...triggerProps }) => {
                    return (
                      <TouchableOpacity {...triggerProps}>
                        <HStack
                          space='xs'
                          className='items-center justify-between bg-primary-500/20 px-2 py-0.5 rounded-full border-[1px] border-primary-500'
                        >
                          <Text className='text-sm text-primary-500'>
                            {distance} km
                          </Text>
                          <Ionicons
                            name="chevron-down-outline"
                            size={14}
                            color="#e44b5e"
                          />
                        </HStack>
                      </TouchableOpacity>
                    );
                  }}
                >
                  {distances.map(dis => (
                    <MenuItem
                      key={dis}
                      textValue={dis.toString()}
                      className={`justify-center ${distance === dis && 'bg-primary-500/20'}`}
                      onPress={() => setDistance(dis)}
                    >
                      <MenuItemLabel
                        className={`${distance === dis && 'text-primary-500'}`}
                        size="sm"
                      >
                        {dis} km
                      </MenuItemLabel>
                    </MenuItem>
                  ))}
                </Menu>
              </HStack>
              <HStack
                space="sm"
                className="items-center"
              >
                <Text className='text-md text-typography-600'>
                  de
                </Text>
                <OriginLocationMenu
                  placement="top"
                  className='mb-14'
                  locations={savedLocations}
                  selectedId={selectedId}
                  originName={originName}
                  onSelect={selectLocation}
                  onSelectMyLocation={selectMyLocation}
                  onAddLocation={openAddLocation}
                />
              </HStack>
            </HStack>
            <HStack
              space="sm"
              className="items-center w-full"
            >
              <Text className='text-md text-typography-600'>
                en
              </Text>
              <Menu
                placement="top"
                className='mb-16'
                style={{ maxWidth: 200, maxHeight: 500 }}
                offset={5}
                closeOnSelect={false}
                onClose={handleCloseMenuStore}
                trigger={({ ...triggerProps }) => {
                  return (
                    <TouchableOpacity
                      className={selectedStoresName.length > 40 && 'flex-1'}
                      {...triggerProps}
                    >
                      <HStack
                        space='xs'
                        className={`
                          ${selectedStoresName.length > 40 && 'flex-1'} 
                          items-center bg-primary-500/20 px-2 py-0.5 rounded-full border-[1px] border-primary-500
                        `}
                      >
                        <Text
                          className={`
                            text-sm text-primary-500
                            ${selectedStoresName.length > 40 && 'flex-1'}
                          `}
                          numberOfLines={1}
                          ellipsizeMode='tail'
                        >
                          {selectedStoresName}
                        </Text>
                        <Ionicons
                          name="chevron-down-outline"
                          size={14}
                          color="#e44b5e"
                        />
                      </HStack>
                    </TouchableOpacity>
                  );
                }}
              >
                <MenuItem
                  key="all-stores"
                  textValue="all-stores"
                  className={`
                    justify-center 
                    ${storesId.length === 0
                    && 'bg-primary-500/20 justify-between p-2'}
                  `}
                  onPress={() => pushStoresId('all-stores')}
                >
                  <MenuItemLabel
                    className={`
                      text-center uppercase 
                      ${storesId.length === 0 && 'text-primary-500'}
                    `}
                    size="sm"
                  >
                    Todos los comercios
                  </MenuItemLabel>
                  {storesId.length === 0 && (
                    <Ionicons
                      name="caret-back-outline"
                      size={26}
                      color="#e44b5e"
                      className="-mr-2"
                    />
                  )}
                </MenuItem>
                {availableStores.map(store => (
                  <MenuItem
                    key={store.id}
                    textValue={store.id}
                    className={`
                      justify-center mt-1 ${storesId.length === 0 && 'bg-primary-500/20'}
                      ${storesId.includes(store.id) && 'bg-primary-500/20'}
                    `}
                    onPress={() => pushStoresId(store.id)}
                  >
                    <MenuItemLabel
                      className={`
                        text-center uppercase 
                        ${storesId.length === 0 && 'text-primary-500'}
                        ${storesId.includes(store.id) && 'text-primary-500 '}
                      `}
                      size="sm"
                    >
                      {store.name}
                    </MenuItemLabel>
                  </MenuItem>
                ))}
              </Menu>
            </HStack>
          </VStack>
        </SafeAreaView>
        <AddLocationModal
          isOpen={showAddLocationModal}
          onClose={closeAddLocation}
        />
      </ModalContent>
    </Modal >
  );
};
