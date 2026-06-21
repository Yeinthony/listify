import { Text } from '@/components/ui/text';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '@/components/generals/CustomHeader';
import { VStack } from '@/components/ui/vstack';
import { Center } from '@/components/ui/center';
import { Spinner } from '@/components/ui/spinner';
import { FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { useLists } from '@/hooks/screens/useLists';
import { ListCard } from '@/components/cards/ListCard';
import CreateListModal from '@/components/modals/CreateListModal';
import AlertModal from '@/components/modals/AlertModal';
import { ListSummary } from '@/types/shopping-lists';

export default function Lists() {
  const { t } = useTranslation();
  const { lists, loading, refreshing, refetch, createList, deleteList } = useLists();

  const [showCreate, setShowCreate] = useState(false);
  const [toDelete, setToDelete] = useState<ListSummary | null>(null);

  return (
    <VStack className='flex-1 bg-background-100'>
      <VStack className='w-full pb-4 bg-primary-500 rounded-b-[15%] relative'>
        <SafeAreaView>
          <CustomHeader
            title={t('screen.lists.title')}
            white
            leftButtom={
              <TouchableOpacity
                className='bg-background-0 p-2 rounded-xl'
                onPress={() => setShowCreate(true)}
              >
                <Ionicons name="add" size={22} color="#e44b5e" />
              </TouchableOpacity>
            }
          />
        </SafeAreaView>
      </VStack>

      <VStack className='flex-1'>
        {loading ? (
          <Center className='flex-1'>
            <Spinner />
          </Center>
        ) : (
          <FlatList
            data={lists}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16, gap: 12, flexGrow: 1 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refetch} />}
            ListEmptyComponent={
              <Center className='flex-1'>
                <Text className='text-typography-600'>{t('screen.lists.empty')}</Text>
              </Center>
            }
            renderItem={({ item }) => (
              <ListCard
                list={item}
                onPress={() => router.push({ pathname: '/main/list-detail', params: { id: item.id } })}
                onDelete={() => setToDelete(item)}
              />
            )}
          />
        )}
      </VStack>

      <CreateListModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={createList}
      />

      <AlertModal
        isOpen={!!toDelete}
        type='error'
        title={t('screen.lists.deleteTitle')}
        description={t('screen.lists.deleteDescription')}
        onClose={() => setToDelete(null)}
        onAction={() => {
          if (toDelete) deleteList(toDelete.id);
          setToDelete(null);
        }}
      />
    </VStack>
  );
}
