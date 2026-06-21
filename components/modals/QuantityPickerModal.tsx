import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { Center } from "@/components/ui/center";
import { TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Ionicons from '@expo/vector-icons/Ionicons';
import { QuantityPickerModalProps } from "./types/quantity-picker-modal";

const QuantityPickerModal = ({ isOpen, onClose, onConfirm, confirming }: QuantityPickerModalProps) => {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isOpen) setQuantity(1);
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalBackdrop />
      <ModalContent className="rounded-2xl">
        <ModalHeader>
          <Heading size="md">{t('screen.lists.quantityTitle')}</Heading>
        </ModalHeader>
        <ModalBody>
          <HStack className="items-center justify-center" space="xl">
            <TouchableOpacity
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              className="bg-background-100 h-12 w-12 rounded-full items-center justify-center"
            >
              <Ionicons name="remove" size={22} color="#6b7280" />
            </TouchableOpacity>
            <Text className="text-3xl font-extrabold" style={{ fontVariant: ['tabular-nums'] }}>
              {quantity}
            </Text>
            <TouchableOpacity
              onPress={() => setQuantity((q) => q + 1)}
              className="bg-background-100 h-12 w-12 rounded-full items-center justify-center"
            >
              <Ionicons name="add" size={22} color="#6b7280" />
            </TouchableOpacity>
          </HStack>
        </ModalBody>
        <ModalFooter>
          <TouchableOpacity
            onPress={onClose}
            className="px-6 rounded-2xl h-12 border-[1.5px] border-typography-600 justify-center items-center"
          >
            <Text>{t('button.cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onConfirm(quantity)} disabled={confirming}>
            <Center className="bg-primary-500 rounded-2xl h-12 px-6">
              <Text className="font-medium text-white">{t('button.add')}</Text>
            </Center>
          </TouchableOpacity>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default QuantityPickerModal;
