import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
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
import { useListItemPrices } from '@/hooks/screens/useListItemPrices';
import { ListItemCard } from '@/components/cards/ListItemCard';
import UpdateItemModal from '@/components/modals/UpdateItemModal';
import AlertModal from '@/components/modals/AlertModal';
import { BarcodeScanModal } from '@/components/modals/BarcodeScanModal';
import { Shadow } from 'react-native-shadow-2';
import { ListItem } from '@/types/shopping-lists';

const money = (n: number) => `$${Math.round(n).toLocaleString('es-AR')}`;

export default function ListDetail() {
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const id = Array.isArray(params.id) ? params.id[0] : params.id || '';

  const { list, loading, refreshing, refetch, updateItem, updatingItem, removeItem } = useListDetail(id);
  const { priceByProductId, total } = useListItemPrices(list?.items ?? []);

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

      {!!list?.items?.length && (
        <TouchableOpacity
          className='mx-4 mb-1 bg-primary-500/10 rounded-2xl p-4 flex-row items-center'
          style={{ borderCurve: 'continuous' }}
          onPress={() => router.push({ pathname: '/main/list-branch-prices', params: { id } })}
        >
          <Center className='h-11 w-11 rounded-xl bg-primary-500'>
            <Ionicons name='wallet-outline' size={22} color='white' />
          </Center>
          <VStack className='ml-3'>
            <Heading className='text-[15px] font-bold'>{t('screen.lists.estimatedTotal')}</Heading>
            <Text className='text-xs text-typography-600'>{t('screen.lists.viewByBranch')}</Text>
          </VStack>
          <Heading
            className='text-2xl font-extrabold text-primary-600 ml-auto'
            style={{ fontVariant: ['tabular-nums'] }}
          >
            {money(total)}
          </Heading>
          <Ionicons name='chevron-forward' size={20} color='#e44b5e' />
        </TouchableOpacity>
      )}

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
                unitPrice={priceByProductId[item.product.id]}
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
        <Shadow
          distance={5}
          startColor='rgba(0,0,0,0.11)'
          offset={[0, 3]}
          style={{ borderRadius: 25 }}
          containerStyle={{
            position: 'absolute',
            alignSelf: 'center',
            bottom: insets.bottom + 20,
          }}
        >
          <TouchableOpacity
            onPress={() => setShowScan(true)}
            activeOpacity={0.9}
            className='bg-primary-500 rounded-full h-14 px-6 flex-row items-center justify-center'
          >
            <Ionicons name="add-circle-outline" size={22} color="white" />
            <Text className='text-white font-medium ml-2'>{t('screen.lists.addProducts')}</Text>
          </TouchableOpacity>
        </Shadow>
      )}

      <BarcodeScanModal
        isOpen={showScan}
        onClose={() => setShowScan(false)}
        targetListId={id}
      />
    </VStack>
  );
}
