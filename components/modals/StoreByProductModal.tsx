
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

export const StoreByProductModal = ({
  isOpen, 
  ean,
  store,
  onClose
}: StoreByProductModalProps) => {
  const { t } = useTranslation()
  const { 
    data,
    loading 
  } = useStoreByProduct({isOpen, ean, store})

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
    >
      <ModalBackdrop />
      <ModalContent className='rounded-2xl max-h-[85%]'>
        <ModalHeader>
          <Heading className='flex-1 text-lg'>
            {store?.name}
          </Heading>
          <ModalCloseButton>
            <Icon as={CloseIcon} />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody className='mt-6'>
          {loading && !data ? (
            <Center className="flex-1">
              <Spinner 
                size="large" 
                className="mr-2 mt-3" 
                color="#e44b5e"
              />
            </Center>
          ) : (
            data?.map((item, i) => (
              <Text key={i} >
                {item.branch.name}
              </Text>
            ))
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
 