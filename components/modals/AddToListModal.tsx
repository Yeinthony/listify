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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { addListItem } from "@/api/shoppingLists.api";
import { shoppingListKeys } from "@/api/queryKeys";
import { useLists } from "@/hooks/screens/useLists";
import { ApiError } from "@/utils/apiError";
import useSnackbarStore from "@/store/snackbarStore";
import { AddToListModalProps } from "./types/add-to-list-modal";

const AddToListModal = ({ isOpen, onClose, productId }: AddToListModalProps) => {
  const { t } = useTranslation();
  const { lists } = useLists();
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbarStore();

  const editableLists = lists.filter((list) => list.myRole !== 'reader');

  const mutation = useMutation({
    mutationFn: (listId: string) => addListItem(listId, { productId }).then(res => res.data),
    onSuccess: (_data, listId) => {
      queryClient.invalidateQueries({ queryKey: shoppingListKeys.detail(listId) });
      queryClient.invalidateQueries({ queryKey: ['shopping-lists'] });
      showSnackbar({ message: t('snackbar.itemAdded'), type: 'success' });
      onClose();
    },
    onError: (error) => {
      if (error instanceof ApiError && error.statusCode === 409) {
        showSnackbar({ message: t('snackbar.itemAlreadyInList'), type: 'error' });
      }
    },
  });

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
              onPress={() => mutation.mutate(list.id)}
              isDisabled={mutation.isPending}
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
