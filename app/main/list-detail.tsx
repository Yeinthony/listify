import { Text } from '@/components/ui/text';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomHeader from '@/components/generals/CustomHeader';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Center } from '@/components/ui/center';
import { Spinner } from '@/components/ui/spinner';
import { FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useListDetail } from '@/hooks/screens/useListDetail';
import { ListItemCard } from '@/components/cards/ListItemCard';
import UpdateItemModal from '@/components/modals/UpdateItemModal';
import AlertModal from '@/components/modals/AlertModal';
import { BarcodeScanModal } from '@/components/modals/BarcodeScanModal';
import { ListItem } from '@/types/shopping-lists';

export default function ListDetail() {
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const id = Array.isArray(params.id) ? params.id[0] : params.id || '';

  const { list, loading, refreshing, refetch, updateItem, updatingItem, removeItem } = useListDetail(id);

  const [editItem, setEditItem] = useState<ListItem | null>(null);
  const [toRemove, setToRemove] = useState<ListItem | null>(null);
  const [showScan, setShowScan] = useState(false);

  const canEdit = list?.myRole === 'editor' || list?.myRole === 'owner';

  return (
    <VStack className='flex-1 bg-background-100'>
      <VStack className='w-full pb-4 bg-primary-500 rounded-b-[15%]'>
        <SafeAreaView>
          <CustomHeader title={list?.name ?? t('screen.lists.detailTitle')} white />
        </SafeAreaView>
      </VStack>

      <HStack className='px-4 py-3' space='sm'>
        <TouchableOpacity
          className='flex-1 bg-primary-500 rounded-2xl h-12 items-center justify-center flex-row'
          onPress={() => router.push({ pathname: '/main/list-optimizer', params: { id } })}
        >
          <Ionicons name="sparkles-outline" size={18} color="white" />
          <Text className='text-white font-medium ml-2'>{t('screen.lists.optimize')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className='bg-background-0 rounded-2xl h-12 px-4 items-center justify-center flex-row'
          onPress={() => router.push({ pathname: '/main/list-collaborators', params: { id } })}
        >
          <Ionicons name="people-outline" size={18} color="#6b7280" />
          <Text className='font-medium ml-2'>{t('screen.lists.collaborators')}</Text>
        </TouchableOpacity>
      </HStack>

      <VStack className='flex-1'>
        {loading ? (
          <Center className='flex-1'>
            <Spinner />
          </Center>
        ) : (
          <FlatList
            data={list?.items ?? []}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 96, gap: 12, flexGrow: 1 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refetch} />}
            ListEmptyComponent={
              <Center className='flex-1'>
                <Text className='text-typography-600'>{t('screen.lists.emptyItems')}</Text>
              </Center>
            }
            renderItem={({ item }) => (
              <ListItemCard
                item={item}
                canEdit={!!canEdit}
                onEdit={() => setEditItem(item)}
                onRemove={() => setToRemove(item)}
              />
            )}
          />
        )}
      </VStack>

      <UpdateItemModal
        isOpen={!!editItem}
        item={editItem}
        saving={updatingItem}
        onClose={() => setEditItem(null)}
        onSave={(data) => updateItem({ itemId: editItem!.id, data })}
      />

      <AlertModal
        isOpen={!!toRemove}
        type='error'
        title={t('screen.lists.removeItemTitle')}
        description={t('screen.lists.removeItemDescription')}
        onClose={() => setToRemove(null)}
        onAction={() => {
          if (toRemove) removeItem(toRemove.id);
          setToRemove(null);
        }}
      />

      {canEdit && (
        <TouchableOpacity
          onPress={() => setShowScan(true)}
          className='absolute self-center bg-primary-500 rounded-full h-14 px-6 flex-row items-center justify-center shadow-xl'
          style={{ bottom: insets.bottom + 20 }}
        >
          <Ionicons name="add-circle-outline" size={22} color="white" />
          <Text className='text-white font-medium ml-2'>{t('screen.lists.addProducts')}</Text>
        </TouchableOpacity>
      )}

      <BarcodeScanModal
        isOpen={showScan}
        onClose={() => setShowScan(false)}
        targetListId={id}
      />
    </VStack>
  );
}
