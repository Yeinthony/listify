import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { shoppingListKeys } from "@/api/queryKeys";
import {
  addListItem,
  getListById,
  removeListItem,
  updateList,
  updateListItem,
} from "@/api/shoppingLists.api";
import {
  AddItemPayload,
  UpdateItemPayload,
  UpdateListPayload,
} from "@/api/types/shopping-lists";
import { ApiError } from "@/utils/apiError";
import useSnackbarStore from "@/store/snackbarStore";

export const useListDetail = (id: string) => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbarStore();
  const { t } = useTranslation();

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: shoppingListKeys.detail(id),
    queryFn: () => getListById(id).then(res => res.data),
    enabled: !!id,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: shoppingListKeys.detail(id) });
    queryClient.invalidateQueries({ queryKey: ['shopping-lists'] });
  };

  const addItemMutation = useMutation({
    mutationFn: (payload: AddItemPayload) => addListItem(id, payload).then(res => res.data),
    onSuccess: invalidate,
    onError: (error) => {
      if (error instanceof ApiError && error.statusCode === 409) {
        showSnackbar({ message: t('snackbar.itemAlreadyInList'), type: 'error' });
      }
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ itemId, data: payload }: { itemId: string; data: UpdateItemPayload }) =>
      updateListItem(id, itemId, payload).then(res => res.data),
    onSuccess: invalidate,
  });

  const removeItemMutation = useMutation({
    mutationFn: (itemId: string) => removeListItem(id, itemId).then(res => res.data),
    onSuccess: invalidate,
  });

  const updateListMutation = useMutation({
    mutationFn: (payload: UpdateListPayload) => updateList(id, payload).then(res => res.data),
    onSuccess: invalidate,
  });

  return {
    list: data,
    loading: isLoading,
    refreshing: isRefetching,
    refetch,
    addItem: addItemMutation.mutateAsync,
    adding: addItemMutation.isPending,
    updateItem: updateItemMutation.mutateAsync,
    updatingItem: updateItemMutation.isPending,
    removeItem: removeItemMutation.mutate,
    removingItem: removeItemMutation.isPending,
    updateList: updateListMutation.mutateAsync,
    updatingList: updateListMutation.isPending,
  };
};
