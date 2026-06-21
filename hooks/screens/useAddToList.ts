import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { addListItem } from "@/api/shoppingLists.api";
import { shoppingListKeys } from "@/api/queryKeys";
import { ApiError } from "@/utils/apiError";
import useSnackbarStore from "@/store/snackbarStore";

interface AddToListArgs {
  listId: string;
  productId: string;
  quantity?: number;
}

export const useAddToList = (onAdded?: () => void) => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbarStore();
  const { t } = useTranslation();

  const mutation = useMutation({
    mutationFn: ({ listId, productId, quantity }: AddToListArgs) =>
      addListItem(listId, { productId, quantity }).then(res => res.data),
    onSuccess: (_data, { listId }) => {
      queryClient.invalidateQueries({ queryKey: shoppingListKeys.detail(listId) });
      queryClient.invalidateQueries({ queryKey: ['shopping-lists'] });
      showSnackbar({ message: t('snackbar.itemAdded'), type: 'success' });
      onAdded?.();
    },
    onError: (error) => {
      if (error instanceof ApiError && error.statusCode === 409) {
        showSnackbar({ message: t('snackbar.itemAlreadyInList'), type: 'error' });
      }
    },
  });

  return {
    addToList: mutation.mutate,
    adding: mutation.isPending,
  };
};
