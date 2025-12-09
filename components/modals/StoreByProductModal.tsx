
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
import {
  Popover,
  PopoverBackdrop,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
} from '@/components/ui/popover';
import Ionicons from '@expo/vector-icons/Ionicons';

export const StoreByProductModal = ({
  isOpen, 
  ean,
  store,
  onClose
}: StoreByProductModalProps) => {
  const { t } = useTranslation()
  const { 
    data,
    loading,
    showDistanceList,
    showLocationList,
    distance,
    setShowDistanceList,
    setShowLocationList,
    setDistance,
  } = useStoreByProduct({isOpen, ean, store})

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
    >
      <ModalBackdrop />
      <ModalContent className='rounded-2xl max-h-[88%] pa-3'>
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
              <Popover
                isOpen={showDistanceList}
                onClose={() => setShowDistanceList(false)}
                onOpen={() => setShowDistanceList(true)}
                placement="bottom"
                size="md"
                trigger={(triggerProps) => {
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
                <PopoverBackdrop />
                <PopoverContent className=''>
                  <PopoverArrow />
                  <PopoverBody>
                    <Text className="text-sm text-primary-500">
                      5 km
                    </Text>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
              <Text className='text-md text-typography-600'>
                de 
              </Text>
              <Popover
                isOpen={showLocationList}
                onClose={() => setShowLocationList(false)}
                onOpen={() => setShowLocationList(true)}
                placement="bottom"
                size="md"
                trigger={(triggerProps) => {
                  return (
                    <TouchableOpacity {...triggerProps}>
                      <HStack 
                        space='xs' 
                        className='items-center bg-primary-500/20 px-2 py-0.5 rounded-full border-[1px] border-primary-500'
                      >
                        <Text className='text-sm text-primary-500'>
                          mi ubicación
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
                <PopoverBackdrop />
                <PopoverContent className=''>
                  <PopoverArrow />
                  <PopoverBody>
                    <Text className="text-sm text-primary-500">
                      Ubicación actual
                    </Text>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
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
                      {`$${item.price.listPrice}`}
                    </Text>
                  </VStack>
                </HStack>
              ))}
            </VStack>
          )}
        </ModalBody>
        {/* <ModalFooter className='justify-between'>
          <TouchableOpacity
            onPress={onClose}
            className="w-[47%] rounded-2xl h-12 border-[1.5px] border-typography-600 justify-center items-center"
          >
            <Text className="font-medium text-sm">
              {t('button.cancel')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {}}
            className="w-[47%] rounded-2xl h-12 bg-primary-500 justify-center items-center"
          >
            <Text className="font-medium text-white text-sm">
              {t('button.accept')}
            </Text>
          </TouchableOpacity>
        </ModalFooter> */}
      </ModalContent>
      </Modal>
  )
}
 