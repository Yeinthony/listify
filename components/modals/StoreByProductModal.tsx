import React from 'react';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@/components/ui/modal';
import {
  Radio,
  RadioGroup,
  RadioIndicator,
  RadioIcon,
  RadioLabel,
} from '@/components/ui/radio';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Icon, CloseIcon, CircleIcon } from '@/components/ui/icon';
import { useTranslation } from "react-i18next"
import { ModalProps } from "./types/modal";
import { TouchableOpacity } from 'react-native';
import { useLangModal } from './hooks/useLangModal';
import { StoreByProductModalProps } from './types/store-by-product';
import { useStoreByProduct } from './hooks/useStoreByProduct';
import { Center } from '../ui/center';
import { Spinner } from '../ui/spinner';
import { HStack } from '../ui/hstack';
import { VStack } from '../ui/vstack';
import { Menu, MenuItem, MenuItemLabel } from '@/components/ui/menu';
import { OriginLocationMenu } from './OriginLocationMenu';
import { AddLocationModal } from './AddLocationMapModal';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


const StoreByProductModal = ({
  isOpen,
  ean,
  store,
  location,
  onClose,
}: StoreByProductModalProps) => {
  const { t } = useTranslation()
  const {
    data,
    loading,
    distance,
    distances,
    setDistance,
    savedLocations,
    selectedId,
    originName,
    showAddLocationModal,
    selectLocation,
    selectMyLocation,
    openAddLocation,
    closeAddLocation
  } = useStoreByProduct({ isOpen, ean, store, location })

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
    >
      <ModalBackdrop />
      <ModalContent className='pb-0 px-4 pt-4 rounded-2xl max-h-[88%]'>
        <ModalHeader>
          <VStack
            className='w-full'
            space='sm'
          >
            <HStack className='w-full'>
              <Heading className='flex-1 text-lg'>
                {store?.name}
              </Heading>
              <ModalCloseButton>
                <Icon as={CloseIcon} />
              </ModalCloseButton>
            </HStack>
            <HStack
              className='items-center w-full flex-wrap'
              space='xs'
            >
              <Text className='text-md text-typography-600'>
                Sucursales a
              </Text>
              <Menu
                placement="bottom"
                className='min-w-[80px]'
                offset={5}
                closeOnSelect={true}
                trigger={({ ...triggerProps }) => {
                  return (
                    <TouchableOpacity {...triggerProps}>
                      <HStack
                        space='xs'
                        className='items-center bg-primary-500/20 px-2 py-0.5 rounded-full border-[1px] border-primary-500'
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
              <Text className='text-md text-typography-600'>
                de
              </Text>
              <OriginLocationMenu
                placement="bottom"
                className='min-w-[150px]'
                locations={savedLocations}
                selectedId={selectedId}
                originName={originName}
                onSelect={selectLocation}
                onSelectMyLocation={selectMyLocation}
                onAddLocation={openAddLocation}
              />
            </HStack>
          </VStack>
        </ModalHeader>
        <ModalBody className='mt-6'>
          {loading ? (
            <Center className="flex-1">
              <Spinner
                size="large"
                className="mr-2 mt-3"
                color="#e44b5e"
              />
            </Center>
          ) : (
            <VStack space='lg'>
              {data?.length === 0 && (
                <Center className='mx-6'>
                  <Center className='rounded-full p-4 bg-primary-500/20'>
                    <MaterialCommunityIcons
                      name="cube-off-outline"
                      size={50}
                      color="#e44b5e"
                    />
                  </Center>
                  <Text className='text-md text-typography-700 text-center mt-2'>
                    Sin resultados en el rango seleccionado.
                  </Text>
                </Center>
              )}
              {data?.map((item, i) => (
                <HStack
                  key={i}
                  space='xs'
                  className='items-start w-full'
                >
                  <Ionicons
                    name="location-outline"
                    size={20}
                    color="#e44b5e"
                  />
                  <VStack className='flex-1'>
                    <Text className='text-md text-typography-600 flex-1'>
                      {`${item.branch.name}, ${item.branch.province.name} | a ${item.distanceKm.toFixed(2)} km`}
                    </Text>
                    <Text className=' text-md font-semibold'>
                      {`Precio de lista: $${item.price.listPrice}`}
                    </Text>
                  </VStack>
                </HStack>
              ))}
            </VStack>
          )}
        </ModalBody>
        <AddLocationModal
          isOpen={showAddLocationModal}
          onClose={closeAddLocation}
        />
      </ModalContent>
    </Modal>
  )
}

// Custom comparison function to prevent unnecessary re-renders
const arePropsEqual = (
  prevProps: StoreByProductModalProps,
  nextProps: StoreByProductModalProps
) => {
  return (
    prevProps.isOpen === nextProps.isOpen &&
    prevProps.ean === nextProps.ean &&
    prevProps.store?.id === nextProps.store?.id &&
    prevProps.location.lat === nextProps.location.lat &&
    prevProps.location.lng === nextProps.location.lng &&
    prevProps.onClose === nextProps.onClose
  );
};

export default React.memo(StoreByProductModal, arePropsEqual);
export { StoreByProductModal };
