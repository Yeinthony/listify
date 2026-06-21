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
import { Center } from "@/components/ui/center";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { Controller } from "react-hook-form";
import { TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { useCreateListForm } from "../forms/hooks/useCreateListForm";
import { CreateListModalProps } from "./types/create-list-modal";

const CreateListModal = ({ isOpen, onClose, onCreate, creating }: CreateListModalProps) => {
  const { t } = useTranslation();
  const { control, errors, onSubmit } = useCreateListForm({ onCreate, onSuccess: onClose });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalBackdrop />
      <ModalContent className="rounded-2xl">
        <ModalHeader>
          <Heading size="md">{t('screen.lists.create')}</Heading>
        </ModalHeader>
        <ModalBody>
          <VStack space="sm">
            <FormControl isInvalid={!!errors.name} isRequired>
              <Input className="rounded-2xl h-14 bg-background-0" size="lg">
                <Controller
                  name="name"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <InputField
                      placeholder={t('input.placeholder.listName')}
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                />
              </Input>
              <FormControlError>
                <FormControlErrorText>{errors.name?.message}</FormControlErrorText>
              </FormControlError>
            </FormControl>

            <FormControl isInvalid={!!errors.description}>
              <Textarea className="rounded-2xl bg-background-0">
                <Controller
                  name="description"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextareaInput
                      placeholder={t('input.placeholder.listDescription')}
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                />
              </Textarea>
              <FormControlError>
                <FormControlErrorText>{errors.description?.message}</FormControlErrorText>
              </FormControlError>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <TouchableOpacity
            onPress={onClose}
            className="px-6 rounded-2xl h-12 border-[1.5px] border-typography-600 justify-center items-center"
          >
            <Text>{t('button.cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSubmit} disabled={creating}>
            <Center className="bg-primary-500 rounded-2xl h-12 px-6">
              <Text className="font-medium text-white">{t('button.create')}</Text>
            </Center>
          </TouchableOpacity>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateListModal;
