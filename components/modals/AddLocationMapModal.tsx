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
import { Location } from "@/store/types/manage-location.store";
import { useAddLocationsMapModal } from "./hooks/useAddLocationMapModal";
import { StatusBar } from "expo-status-bar";
import { Image } from "../ui/image";
import { FormControl, FormControlError, FormControlErrorText } from "../ui/form-control";
import { Input, InputField } from "../ui/input";
import { Controller } from "react-hook-form";
import MapView from "react-native-maps";
import Ionicons from "@expo/vector-icons/Ionicons";
import AlertModal from "./AlertModal";
import { AddressAutocomplete } from "../inputs/AddressAutocomplete";

export const AddLocationModal = ({ isOpen, onClose, location }: ModalProps & { location?: Location }) => {
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
    addressLabel,
    isLocating,
    isEdit,
    centerOnInitial,
    centerOnCurrentLocation,
    onSelectAddress,
    onSubmit,
    handlerRegionChangeComplete,
    handleClose,
    createLocation
  } = useAddLocationsMapModal({ isOpen, onClose, location });

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
              onMapReady={centerOnInitial}
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
              {isEdit ? t('screen.add-location.editTitle') : t('screen.add-location.title')}
            </Heading>
            <HStack className="items-center" space="xs">
              <Ionicons name="location-sharp" size={16} color="#e44b5e" />
              {isLocating ? (
                <Text className="text-sm text-typography-500">
                  {t('screen.add-location.locating')}
                </Text>
              ) : addressLabel ? (
                <Text className="text-sm text-typography-700 flex-1" numberOfLines={2}>
                  {addressLabel}
                </Text>
              ) : (
                <Text className="text-sm text-typography-400 flex-1">
                  {t('screen.add-location.moveMapHint')}
                </Text>
              )}
            </HStack>
            <VStack space="sm">
              <FormControl
                isInvalid={!!errors.title}
                size="md"
                isRequired={true}
              >
                <Text className="text-typography-600">{t('screen.add-location.label')}</Text>
                <Input className="my-1 rounded-2xl h-12 bg-background-0" size="lg">
                  <Controller
                    name="title"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <InputField
                        className="text-sm"
                        value={value}
                        placeholder={t('screen.add-location.labelPlaceholder')}
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
            </VStack>
            <TouchableOpacity onPress={onSubmit}>
              <Center
                className={
                  `bg-primary-500 rounded-2xl px-4 h-12`
                }
              >
                <Text className="font-medium text-white">
                  {t('screen.add-location.confirm')}
                </Text>
              </Center>
            </TouchableOpacity>

            <AlertModal
              type="info"
              title={t('screen.add-location.confirmTitle')}
              description={t('screen.add-location.confirmDescription')}
              isOpen={showAlertModal}
              onClose={() => setShowAlertModal(false)}
              onAction={createLocation}
            />
          </VStack>
        </VStack>
        <HStack
          className="items-start mx-4 absolute left-0 right-0 z-10"
          space="sm"
          style={[
          { top: insets.top}
        ]}
        >
          <TouchableOpacity
            onPress={handleClose}
            className="bg-background-0 p-2 rounded-xl mt-1"
          >
            <Ionicons
              name="chevron-back"
              size={20}
              color={colorScheme === "dark" ? "white" : "black"}
            />
          </TouchableOpacity>
          <VStack className="flex-1">
            <AddressAutocomplete onSelect={onSelectAddress} />
          </VStack>
        </HStack>
      </ModalContent>
    </Modal >
  );
};
