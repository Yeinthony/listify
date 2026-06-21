import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
} from "@/components/ui/actionsheet";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Center } from "@/components/ui/center";
import { useTranslation } from "react-i18next";
import { useLists } from "@/hooks/screens/useLists";
import { useAddToList } from "@/hooks/screens/useAddToList";
import { AddToListModalProps } from "./types/add-to-list-modal";

const AddToListModal = ({ isOpen, onClose, productId }: AddToListModalProps) => {
  const { t } = useTranslation();
  const { lists } = useLists();
  const { addToList, adding } = useAddToList(onClose);

  const editableLists = lists.filter((list) => list.myRole !== 'reader');

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        <VStack className="w-full px-4 py-2">
          <Heading size="sm">{t('screen.lists.addToList')}</Heading>
        </VStack>
        {editableLists.length === 0 ? (
          <Center className="w-full py-6">
            <Text className="text-typography-600">{t('screen.lists.empty')}</Text>
          </Center>
        ) : (
          editableLists.map((list) => (
            <ActionsheetItem
              key={list.id}
              onPress={() => addToList({ listId: list.id, productId })}
              isDisabled={adding}
            >
              <ActionsheetItemText>{list.name}</ActionsheetItemText>
            </ActionsheetItem>
          ))
        )}
      </ActionsheetContent>
    </Actionsheet>
  );
};

export default AddToListModal;
