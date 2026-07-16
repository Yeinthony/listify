import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Center } from '@/components/ui/center';
import { FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useListCollaborators } from '@/hooks/screens/useListCollaborators';
import { useListDetail } from '@/hooks/screens/useListDetail';
import { useUserStore } from '@/store/userStore';
import { InviteCollaborator } from '@/components/forms/InviteCollaborator';
import { CollaboratorCard } from '@/components/cards/CollaboratorCard';
import { CollaboratorCardSkeleton } from '@/components/cards/CollaboratorCardSkeleton';
import AlertModal from '@/components/modals/AlertModal';
import { ListCollaborator } from '@/types/shopping-lists';

export default function ListCollaborators() {
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id || '';

  const { collaborators, loading, refreshing, refetch, invite, inviting, changeRole, remove, leave } =
    useListCollaborators(id);
  const { list } = useListDetail(id);
  const user = useUserStore((s) => s.user);

  const [pendingRemove, setPendingRemove] = useState<ListCollaborator | null>(null);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  const isOwner = list?.myRole === 'owner';
  const owner = list?.owner;

  const ownerAsCollaborator: ListCollaborator | null = owner
    ? {
        id: `owner-${owner.id}`,
        listId: id,
        userId: owner.id,
        role: 'owner',
        createdAt: '',
        updatedAt: '',
        user: owner,
      }
    : null;

  const excludeUserIds = [
    ...(owner ? [owner.id] : []),
    ...collaborators.map((c) => c.userId),
  ];

  const listHeader = (
    <VStack space='md'>
      {isOwner && (
        <InviteCollaborator onInvite={invite} inviting={inviting} excludeUserIds={excludeUserIds} />
      )}

      {ownerAsCollaborator && (
        <CollaboratorCard collaborator={ownerAsCollaborator} isYou={owner?.id === user?.id} />
      )}

      {collaborators.length > 0 && (
        <Text className='text-xs text-typography-500 mt-1' style={{ fontVariant: ['tabular-nums'] }}>
          {t('screen.lists.collaboratorsCount', { count: collaborators.length })}
        </Text>
      )}
    </VStack>
  );

  return (
    <VStack className='flex-1 bg-background-100'>
      <VStack className='bg-primary-500 rounded-b-[28px] pb-9' style={{ borderCurve: 'continuous' }}>
        <SafeAreaView edges={['top']}>
          <HStack space='sm' className='items-center px-4 pt-1 pb-2'>
            <TouchableOpacity onPress={() => router.back()} className='bg-white/20 p-2 rounded-xl'>
              <Ionicons name='chevron-back' size={20} color='white' />
            </TouchableOpacity>
            <Heading size='lg' className='text-white'>{t('screen.lists.collaborators')}</Heading>
          </HStack>
        </SafeAreaView>
      </VStack>

      <FlatList
        data={collaborators}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24, gap: 12, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refetch} />}
        ListHeaderComponent={listHeader}
        renderItem={({ item }) => (
          <CollaboratorCard
            collaborator={item}
            canManage={isOwner}
            isYou={item.userId === user?.id}
            onChangeRole={(role) => changeRole({ collabId: item.id, data: { role } })}
            onRemove={() => setPendingRemove(item)}
          />
        )}
        ListEmptyComponent={
          loading ? (
            <VStack space='md' className='pt-1'>
              {Array.from({ length: 4 }).map((_, i) => <CollaboratorCardSkeleton key={i} />)}
            </VStack>
          ) : (
            <Center className='flex-1 py-20 px-10'>
              <Center className='h-20 w-20 rounded-full bg-primary-500/10 mb-4'>
                <Ionicons name='people-outline' size={34} color='#e44b5e' />
              </Center>
              <Heading size='sm' className='text-center'>{t('screen.lists.emptyCollaboratorsTitle')}</Heading>
              <Text className='text-typography-600 text-center mt-1'>
                {isOwner ? t('screen.lists.emptyCollaborators') : t('screen.lists.emptyCollaboratorsReader')}
              </Text>
            </Center>
          )
        }
      />

      {!isOwner && list && (
        <VStack className='px-4 pb-6'>
          <TouchableOpacity onPress={() => setShowLeaveConfirm(true)}>
            <Center className='border-[1.5px] border-error-500 rounded-2xl h-12'>
              <Text className='text-error-500 font-medium'>{t('screen.lists.leave')}</Text>
            </Center>
          </TouchableOpacity>
        </VStack>
      )}

      <AlertModal
        isOpen={!!pendingRemove}
        type='error'
        title={t('screen.lists.removeCollaboratorTitle')}
        description={t('screen.lists.removeCollaboratorMsg')}
        onClose={() => setPendingRemove(null)}
        onAction={() => {
          if (pendingRemove) remove(pendingRemove.id);
          setPendingRemove(null);
        }}
      />

      <AlertModal
        isOpen={showLeaveConfirm}
        type='error'
        title={t('screen.lists.leaveTitle')}
        description={t('screen.lists.leaveMsg')}
        onClose={() => setShowLeaveConfirm(false)}
        onAction={async () => {
          setShowLeaveConfirm(false);
          await leave();
          router.back();
        }}
      />
    </VStack>
  );
}
