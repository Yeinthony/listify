
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
import { Icon, CloseIcon, CircleIcon } from '@/components/ui/icon';
import { useTranslation } from "react-i18next"
import { ModalProps } from "./types/modal";
import { AppleMaps, GoogleMaps } from 'expo-maps';
import { Platform, StyleSheet, useColorScheme } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { VStack } from '../ui/vstack';
import { HStack } from '../ui/hstack';
import Ionicons from '@expo/vector-icons/Ionicons';

export const BranchsMapModal = ({
  isOpen, 
  onClose, 
}: ModalProps) => {
  const { t } = useTranslation()
  const colorScheme = useColorScheme();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
    >
      <ModalBackdrop />
      <ModalContent className='flex-1 border-0'>
        {Platform.OS === 'ios' ? (
          <AppleMaps.View style={StyleSheet.absoluteFill} />
        ) : (
          <GoogleMaps.View style={StyleSheet.absoluteFill} />
        )}
        <VStack className='flex-1 justify-between'>
          <HStack space="md" className="items-center mt-6">
            <TouchableOpacity 
              onPress={onClose}
              className="bg-background-0 p-2 rounded-xl"
            >
              <Ionicons 
                name="chevron-back" 
                size={20} 
                color={colorScheme === 'dark' ? 'white' : 'black'} 
              />
            </TouchableOpacity>
          </HStack>
        </VStack>
      </ModalContent>
      </Modal>
  )
}
 