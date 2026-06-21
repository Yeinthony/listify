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
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Center } from "@/components/ui/center";
import { Image } from "@/components/ui/image";
import { TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Ionicons from '@expo/vector-icons/Ionicons';
import { UpdateItemModalProps } from "./types/update-item-modal";

const PLACEHOLDER_IMG = 'https://picsum.photos/200/300';

const UpdateItemModal = ({ isOpen, item, onClose, onSave, saving }: UpdateItemModalProps) => {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (item) setQuantity(item.quantity);
  }, [item]);

  const onConfirm = async () => {
    await onSave({ quantity });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalBackdrop />
      <ModalContent className="rounded-2xl">
        <ModalHeader>
          <Heading size="md">{t('screen.lists.editQuantity')}</Heading>
        </ModalHeader>
        <ModalBody>
          <VStack space="xl">
            {item && (
              <HStack space="md" className="items-center">
                <Image
                  source={{ uri: item.product.imageUrl || PLACEHOLDER_IMG }}
                  className="w-12 h-12 rounded-xl"
                  alt={item.product.name}
                />
                <VStack className="flex-1">
                  <Heading className="text-[14px] font-bold uppercase" numberOfLines={2}>
                    {item.product.name}
                  </Heading>
                  <Text className="text-sm text-typography-600 capitalize">
                    {`${item.product.presentationQty} ${item.product.presentationUnit}`}
                  </Text>
                </VStack>
              </HStack>
            )}

            <HStack className="items-center justify-center" space="2xl">
              <TouchableOpacity
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                className="bg-background-100 h-12 w-12 rounded-full items-center justify-center"
              >
                <Ionicons name="remove" size={22} color="#6b7280" />
              </TouchableOpacity>
              <Text className="text-4xl font-extrabold" style={{ fontVariant: ['tabular-nums'] }}>
                {quantity}
              </Text>
              <TouchableOpacity
                onPress={() => setQuantity((q) => q + 1)}
                className="bg-background-100 h-12 w-12 rounded-full items-center justify-center"
              >
                <Ionicons name="add" size={22} color="#6b7280" />
              </TouchableOpacity>
            </HStack>
          </VStack>
        </ModalBody>
        <ModalFooter className="justify-center">
          <TouchableOpacity
            onPress={onClose}
            className="flex-1 rounded-2xl h-12 border-[1.5px] border-typography-600 justify-center items-center"
          >
            <Text>{t('button.cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onConfirm} disabled={saving} className="flex-1">
            <Center className="bg-primary-500 rounded-2xl h-12">
              <Text className="font-medium text-white">{t('button.save')}</Text>
            </Center>
          </TouchableOpacity>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UpdateItemModal;
