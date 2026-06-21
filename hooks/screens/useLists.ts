import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { shoppingListKeys } from "@/api/queryKeys";
import { createList, deleteList, getLists } from "@/api/shoppingLists.api";
import { CreateListPayload } from "@/api/types/shopping-lists";

export const useLists = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: shoppingListKeys.list(1),
    queryFn: () => getLists().then(res => res.data),
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['shopping-lists'] });

  const createMutation = useMutation({
    mutationFn: (payload: CreateListPayload) => createList(payload).then(res => res.data),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteList(id).then(res => res.data),
    onSuccess: invalidate,
  });

  return {
    lists: data?.data ?? [],
    meta: data?.meta,
    loading: isLoading,
    refreshing: isRefetching,
    refetch,
    createList: createMutation.mutateAsync,
    creating: createMutation.isPending,
    deleteList: deleteMutation.mutate,
    deleting: deleteMutation.isPending,
  };
};
