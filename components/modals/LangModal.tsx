
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

export const LangModal = ({
  isOpen, 
  onClose, 
}: ModalProps) => {
  const { t } = useTranslation()
  const {
    selectedLang,
    setSelectedLang,
    handlerLang
  } = useLangModal()

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
    >
      <ModalBackdrop />
      <ModalContent className='rounded-2xl'>
        <ModalHeader>
          <Heading size="lg">
            {t('modal.language.title')}
          </Heading>
          <ModalCloseButton>
            <Icon as={CloseIcon} />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody className='mt-6 mb-8'>
          <RadioGroup 
            value={selectedLang}
            onChange={setSelectedLang}
          >
            <Radio 
              value="es" 
              size="md" 
              isInvalid={false} 
              isDisabled={false}
              className={`
                border-[2px] p-3 rounded-2xl
                ${selectedLang === 'es' ? 'border-primary-500' : 'border-typography-400'}
              `}
            >
              <RadioIndicator>
                <RadioIcon as={CircleIcon} />
              </RadioIndicator>
              <RadioLabel>
                {t('modal.language.options.spanish')}
              </RadioLabel>
            </Radio>
            <Radio 
              value="en" 
              size="md" 
              isInvalid={false} 
              isDisabled={false}
              className={`
                border-[2px] p-3 rounded-2xl
                ${selectedLang === 'en' ? 'border-primary-500' : 'border-typography-400'}
              `}
            >
              <RadioIndicator>
                <RadioIcon as={CircleIcon} />
              </RadioIndicator>
              <RadioLabel>
                {t('modal.language.options.english')}
              </RadioLabel>
            </Radio>
          </RadioGroup>
        </ModalBody>
        <ModalFooter className='justify-between'>
          <TouchableOpacity
            onPress={onClose}
            className="w-[47%] rounded-2xl h-12 border-[1.5px] border-typography-600 justify-center items-center"
          >
            <Text className="font-medium text-sm">
              {t('button.cancel')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handlerLang()
              onClose()
            }}
            className="w-[47%] rounded-2xl h-12 bg-primary-500 justify-center items-center"
          >
            <Text className="font-medium text-white text-sm">
              {t('button.accept')}
            </Text>
          </TouchableOpacity>
        </ModalFooter>
      </ModalContent>
      </Modal>
  )
}
 