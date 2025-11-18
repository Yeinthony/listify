
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@/components/ui/modal';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Icon, CloseIcon } from '@/components/ui/icon';
import { useTranslation } from "react-i18next"
import { ModalProps } from "./types/modal";
import { TouchableOpacity } from 'react-native';
import { useLogoutModal } from './hooks/useLogoutModal';

export const LogoutModal = ({
  isOpen, 
  onClose, 
}: ModalProps) => {
  const { t } = useTranslation()
  const { onLogout } = useLogoutModal()

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
    >
      <ModalBackdrop />
      <ModalContent className='rounded-2xl'>
        <ModalHeader>
          <Heading className='flex-1' size="lg">
            {t('modal.logout.title')}
          </Heading>
          <ModalCloseButton>
            <Icon as={CloseIcon} />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody className='mt-6 mb-8'>
          <Text>
            {t('modal.logout.description')}
          </Text>
        </ModalBody>
        <ModalFooter className='justify-between'>
          <TouchableOpacity
            onPress={onLogout}
            className="w-[47%] rounded-2xl h-12 bg-primary-500 justify-center items-center"
          >
            <Text className="font-medium text-white text-sm">
              {t('button.accept')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onClose}
            className="w-[47%] rounded-2xl h-12 border-[1.5px] border-typography-600 justify-center items-center"
          >
            <Text className="font-medium text-sm">
              {t('button.cancel')}
            </Text>
          </TouchableOpacity>
        </ModalFooter>
      </ModalContent>
      </Modal>
  )
}
 