import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { shoppingListKeys } from "@/api/queryKeys";
import {
  addListCollaborator,
  getListCollaborators,
  leaveList,
  removeListCollaborator,
  updateListCollaboratorRole,
} from "@/api/shoppingLists.api";
import {
  AddCollaboratorPayload,
  UpdateCollaboratorRolePayload,
} from "@/api/types/shopping-lists";

export const useListCollaborators = (id: string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: shoppingListKeys.collaborators(id),
    queryFn: () => getListCollaborators(id).then(res => res.data),
    enabled: !!id,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: shoppingListKeys.collaborators(id) });
    queryClient.invalidateQueries({ queryKey: shoppingListKeys.detail(id) });
  };

  const inviteMutation = useMutation({
    mutationFn: (payload: AddCollaboratorPayload) => addListCollaborator(id, payload).then(res => res.data),
    onSuccess: invalidate,
  });

  const changeRoleMutation = useMutation({
    mutationFn: ({ collabId, data: payload }: { collabId: string; data: UpdateCollaboratorRolePayload }) =>
      updateListCollaboratorRole(id, collabId, payload).then(res => res.data),
    onSuccess: invalidate,
  });

  const removeMutation = useMutation({
    mutationFn: (collabId: string) => removeListCollaborator(id, collabId).then(res => res.data),
    onSuccess: invalidate,
  });

  const leaveMutation = useMutation({
    mutationFn: () => leaveList(id).then(res => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['shopping-lists'] }),
  });

  return {
    collaborators: data ?? [],
    loading: isLoading,
    refreshing: isRefetching,
    refetch,
    invite: inviteMutation.mutateAsync,
    inviting: inviteMutation.isPending,
    changeRole: changeRoleMutation.mutateAsync,
    changingRole: changeRoleMutation.isPending,
    remove: removeMutation.mutate,
    removing: removeMutation.isPending,
    leave: leaveMutation.mutateAsync,
    leaving: leaveMutation.isPending,
  };
};
