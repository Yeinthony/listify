import {
  Modal,
  ModalBackdrop,
  ModalContent,
} from "@/components/ui/modal";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { AppleMaps, GoogleMaps } from "expo-maps";
import { Platform, StyleSheet, useColorScheme } from "react-native";
import { TouchableOpacity } from "react-native";
import { VStack } from "../ui/vstack";
import { HStack } from "../ui/hstack";
import { Center } from "../ui/center";
import { SafeAreaView } from "react-native-safe-area-context";
import { ModalProps } from "./types/modal";
import { useAddLocationsMapModal } from "./hooks/useAddLocationMapModal";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SearchText } from "../inputs/SearchText";
import { StatusBar } from "expo-status-bar";

export const AddLocationModal = ({ isOpen, onClose }: ModalProps) => {
  const colorScheme = useColorScheme();
  const {
     t,
    insets,
    currentLocation,
    zoom,
    locationSelected,
    markersLocations,
    showMap,
    setShowMap,
    zoomOn,
    zoomOut,
    centerOnCurrentLocation,
  } = useAddLocationsMapModal(isOpen);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalBackdrop />
      <ModalContent 
        className={`
          ${showMap ? 'bg-background-0' : 'bg-background-100'} 
          flex-1 border-0 p-0
        `}
      >
        <StatusBar 
          style={showMap ? 'light' : 'auto'}
        />
        {showMap && (
          Platform.OS === "ios" ? (
            <AppleMaps.View
              style={[
                StyleSheet.absoluteFill,
                { bottom: insets.bottom }
              ]}
            />
          ) : (
            <GoogleMaps.View
              style={[
                StyleSheet.absoluteFill,
                { bottom: insets.bottom }
              ]}
              contentPadding={{ start: 15, end: 0, top: 0, bottom: 105 }}
              cameraPosition={{
                coordinates: {
                  latitude: currentLocation.lat,
                  longitude: currentLocation.lng,
                },
                zoom: zoom,
              }}
              properties={{
                isMyLocationEnabled: true,
              }}
              uiSettings={{
                myLocationButtonEnabled: false,
                zoomControlsEnabled: false
              }}
              markers={markersLocations}
              onPOIClick={(poi) => {
                console.log('POI clicked: ', poi);
              }}
            />
          )
        )}
        <SafeAreaView className="flex-1" pointerEvents="box-none">
          <HStack 
            space="md" 
            className={`
              items-center mx-4 mt-2
            `}
          >
            <SearchText 
              className='flex-1 data-[focus=true]:border-background-0'
              value=''
              onTextChange={() => {}}
              onFocus={() => setShowMap(false)}
              onBlur={() => setShowMap(true)}
            />
          </HStack>
          {showMap ? (
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
          ) : (
            <VStack className="flex-1">

            </VStack>
          )}
        </SafeAreaView>
      </ModalContent>
    </Modal >
  );
};
