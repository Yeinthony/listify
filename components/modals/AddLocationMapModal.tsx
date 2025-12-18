import {
  Modal,
  ModalBackdrop,
  ModalContent,
} from "@/components/ui/modal";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { AppleMaps, GoogleMaps } from "expo-maps";
import { Platform, StyleSheet, useColorScheme, Keyboard } from "react-native";
import { TouchableOpacity } from "react-native";
import { VStack } from "../ui/vstack";
import { HStack } from "../ui/hstack";
import { Center } from "../ui/center";
import { SafeAreaView } from "react-native-safe-area-context";
import { ModalProps } from "./types/modal";
import { useAddLocationsMapModal } from "./hooks/useAddLocationMapModal";
import { StatusBar } from "expo-status-bar";
import { useImage } from 'expo-image';
import Ionicons from "@expo/vector-icons/Ionicons";

export const AddLocationModal = ({ isOpen, onClose }: ModalProps) => {
  const colorScheme = useColorScheme();
  const {
    t,
    insets,
    currentLocation,
    zoom,
    locationSelected,
    markersLocations,
    zoomOn,
    zoomOut,
    centerOnCurrentLocation,
  } = useAddLocationsMapModal({ isOpen, onClose });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
    >
      <ModalBackdrop />
      <ModalContent
        className={`
          flex-1 border-0 p-0
        `}
      >
        <StatusBar
          style={isOpen ? 'auto' : 'light'}
        />
        {Platform.OS === "ios" ? (
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
            contentPadding={{ start: 15, end: 0, top: 0, bottom: 0 }}
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
            onMapClick={(event) => {
              console.log('Map clicked: ', event);
            }}
          />
        )}
        <SafeAreaView className="flex-1" pointerEvents="box-none">
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
        </SafeAreaView>
      </ModalContent>
    </Modal >
  );
};
