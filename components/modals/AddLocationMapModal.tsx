import {
  Modal,
  ModalBackdrop,
  ModalContent,
} from "@/components/ui/modal";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { StyleSheet, useColorScheme, View } from "react-native";
import { TouchableOpacity } from "react-native";
import { VStack } from "../ui/vstack";
import { HStack } from "../ui/hstack";
import { Center } from "../ui/center";
import { SafeAreaView } from "react-native-safe-area-context";
import { ModalProps } from "./types/modal";
import { useAddLocationsMapModal } from "./hooks/useAddLocationMapModal";
import { StatusBar } from "expo-status-bar";
import { Image } from "../ui/image";
import { FormControl, FormControlError, FormControlErrorText } from "../ui/form-control";
import { Input, InputField } from "../ui/input";
import { Controller } from "react-hook-form";
import MapView from "react-native-maps";
import Ionicons from "@expo/vector-icons/Ionicons";
import AlertModal from "./AlertModal";

export const AddLocationModal = ({ isOpen, onClose }: ModalProps) => {
  const colorScheme = useColorScheme();
  const {
    t,
    insets,
    markerLocation,
    mapRef,
    isMarkerMove,
    errors,
    control,
    showAlertModal,
    setShowAlertModal,
    setIsMarkerMove,
    centerOnCurrentLocation,
    onSubmit,
    onChangeLat,
    onChangeLng,
    handlerRegionChangeComplete,
    handleClose,
    createLocation
  } = useAddLocationsMapModal({ isOpen, onClose });

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="full"
    >
      <ModalBackdrop />
      <ModalContent
        className={`
          flex-1 relative border-0 p-0
        `}
      >
        <StatusBar
          style={isOpen ? 'auto' : 'light'}
        />
        <VStack           
          style={[
            StyleSheet.absoluteFill,
            { bottom: insets.bottom }
          ]}
        >
          <VStack className="flex-1 relative">
            <MapView
              style={{
                flex: 1
              }}
              ref={mapRef}
              camera={{
                center: markerLocation.current,
                zoom: 18,
                heading: 0,
                pitch: 0
              }}
              mapPadding={{ left: 15, right: 0, top: 25, bottom: 10 }}
              showsUserLocation={true}
              showsMyLocationButton={false}
              onMapReady={centerOnCurrentLocation}
              onRegionChangeStart={() => setIsMarkerMove(true)}
              onRegionChangeComplete={handlerRegionChangeComplete}
            />
            <Center
              pointerEvents="box-none"
              className="absolute w-full h-full"
            >
              <HStack
                className="justify-end p-4 absolute bottom-0 right-0"
                space="sm"
              >
                <TouchableOpacity onPress={centerOnCurrentLocation}>
                  <Center className="bg-background-0/90 rounded-full w-10 h-10 border-[1.5px] border-primary-500">
                    <Ionicons
                      name="locate"
                      size={24}
                      color="#e44b5e"
                    />
                  </Center>
                </TouchableOpacity>
              </HStack>
              <Image
                size="sm"
                source={require('@/assets/images/favorite-pin.png')}
                alt="image"
                className="z-10"
              />
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 50,
                  backgroundColor: "#00000060",
                  transform: [{ scaleX: 2 }],
                  marginTop: isMarkerMove ? 4 : -3
                }}
              />
            </Center>
          </VStack>
          <VStack
            className="bg-background-0 px-4 py-3 rounded-t-3xl"
            space="xl"
          >
            <Heading className="text-lg">
              Confirma tu dirección
            </Heading>
            <VStack space="sm">
              <FormControl
                isInvalid={!!errors.title}
                size="md"
                isRequired={true}
              >
                <Text className="text-typography-600">Titulo</Text>
                <Input className="my-1 rounded-2xl h-12 bg-background-0" size="lg">
                  <Controller
                    name="title"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <InputField
                        className="text-sm"
                        value={value}
                        placeholder="Casa"
                        onChangeText={onChange}
                        type="text"
                      />
                    )}
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorText>
                    {errors.title?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>

              <HStack className="justify-between">
                <FormControl
                  isInvalid={!!errors.latitude}
                  size="md"
                  isRequired={true}
                  style={{width: '48%'}}
                >
                  <Text className="text-typography-600">Latitud</Text>
                  <Input className="my-1 rounded-2xl h-12 bg-background-0" size="lg">
                    <Controller
                      name="latitude"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <InputField
                          className="text-sm"
                          placeholder="-34.60357751306078"
                          value={value}
                          onChangeText={(text) => {
                            onChange(text)
                            onChangeLat(text)
                          }}
                          keyboardType="numeric"
                        />
                      )}
                    />
                  </Input>
                  <FormControlError>
                    <FormControlErrorText>
                      {errors.latitude?.message}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
                <FormControl
                  isInvalid={!!errors.longitude}
                  size="md"
                  isRequired={true}
                  style={{width: '48%'}}
                >
                  <Text className="text-typography-600">Longitud</Text>
                  <Input className="my-1 rounded-2xl h-12 bg-background-0" size="lg">
                    <Controller
                      name="longitude"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <InputField
                          className="text-sm"
                          value={value}
                          placeholder="-58.38158361135673"
                          onChangeText={(text) => {
                            onChange(text)
                            onChangeLng(text)
                          }}
                          keyboardType="numeric"
                        />
                      )}
                    />
                  </Input>
                  <FormControlError>
                    <FormControlErrorText>
                      {errors.longitude?.message}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
              </HStack>
            </VStack>
            <TouchableOpacity onPress={onSubmit}>
              <Center
                className={
                  `bg-primary-500 rounded-2xl px-4 h-12`
                }
              >
                <Text className="font-medium text-white">
                  Confirmar
                </Text>
              </Center>
            </TouchableOpacity>

            <AlertModal 
              type="info"
              title="¿Confirmar dirección?"
              description="Al presionar aceptar quedara registrada esta dirección."
              isOpen={showAlertModal}
              onClose={() => setShowAlertModal(false)}
              onAction={createLocation}
            />
          </VStack>
        </VStack>
        <HStack
          className="items-start mx-4 absolute"
          style={[
          { top: insets.top}
        ]}
        >
          <TouchableOpacity
            onPress={handleClose}
            className="bg-background-0 p-2 rounded-xl"
          >
            <Ionicons
              name="chevron-back"
              size={20}
              color={colorScheme === "dark" ? "white" : "black"}
            />
          </TouchableOpacity>
        </HStack>
      </ModalContent>
    </Modal >
  );
};
