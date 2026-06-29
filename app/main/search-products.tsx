import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Center } from '@/components/ui/center';
import { Spinner } from '@/components/ui/spinner';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SearchText } from '@/components/inputs/SearchText';
import { ProductCard } from '@/components/cards/ProductCard';
import { ProductCardSkeleton } from '@/components/cards/ProductCardSkeleton';
import { useSearchProducts } from '@/hooks/screens/useSearchProducts';

export default function SearchProducts() {
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const listId = Array.isArray(params.listId) ? params.listId[0] : params.listId;
  const [term, setTerm] = useState('');

  const { products, total, enabled, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useSearchProducts(term);

  return (
    <VStack className='flex-1 bg-background-100'>
      <VStack className='bg-primary-500 rounded-b-[28px] pb-9' style={{ borderCurve: 'continuous' }}>
        <SafeAreaView edges={['top']}>
          <HStack space='sm' className='items-center px-4 pt-1 pb-2'>
            <TouchableOpacity onPress={() => router.back()} className='bg-white/20 p-2 rounded-xl'>
              <Ionicons name='chevron-back' size={20} color='white' />
            </TouchableOpacity>
            <Heading size='lg' className='text-white'>{t('screen.search.title')}</Heading>
          </HStack>
        </SafeAreaView>
      </VStack>

      <View className='px-4' style={{ marginTop: -28 }}>
        <View style={{ borderRadius: 16 }}>
          <SearchText
            value={term}
            onTextChange={setTerm}
            placeholder={t('screen.search.placeholder')}
            autoFocus
          />
        </View>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.product.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24, gap: 12, flexGrow: 1 }}
        keyboardShouldPersistTaps='handled'
        ListHeaderComponent={
          enabled && products.length > 0 ? (
            <Text className='text-xs text-typography-500 mb-1' style={{ fontVariant: ['tabular-nums'] }}>
              {t('screen.search.results', { count: total })}
            </Text>
          ) : null
        }
        renderItem={({ item }) => (
          <ProductCard
            flat
            targetListId={listId}
            data={{
              product: item.product,
              stats: {
                min: item.minPrice ?? '0',
                avg: item.avgPrice ?? '0',
                max: item.maxPrice ?? '0',
              },
            }}
          />
        )}
        onEndReached={() => { if (hasNextPage) fetchNextPage(); }}
        onEndReachedThreshold={0.4}
        ListEmptyComponent={
          isLoading ? (
            <VStack space='md' className='pt-1'>
              {Array.from({ length: 5 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </VStack>
          ) : (
            <Center className='flex-1 py-24 px-10'>
              <Center className='h-20 w-20 rounded-full bg-primary-500/10 mb-4'>
                <Ionicons name={enabled ? 'cube-outline' : 'search-outline'} size={34} color='#e44b5e' />
              </Center>
              <Heading size='sm' className='text-center'>
                {enabled ? t('screen.search.emptyTitle') : t('screen.search.minTitle')}
              </Heading>
              <Text className='text-typography-600 text-center mt-1'>
                {enabled ? t('screen.search.empty') : t('screen.search.minChars')}
              </Text>
            </Center>
          )
        }
        ListFooterComponent={isFetchingNextPage ? <Center className='py-4'><Spinner color='#e44b5e' /></Center> : null}
      />
    </VStack>
  );
}
