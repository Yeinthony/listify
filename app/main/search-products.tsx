import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Center } from '@/components/ui/center';
import { Spinner } from '@/components/ui/spinner';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, TouchableOpacity, useColorScheme } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SearchText } from '@/components/inputs/SearchText';
import { ProductCard } from '@/components/cards/ProductCard';
import { useSearchProducts } from '@/hooks/screens/useSearchProducts';

export default function SearchProducts() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const [term, setTerm] = useState('');

  const { products, enabled, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useSearchProducts(term);

  return (
    <VStack className='flex-1 bg-background-100'>
      <SafeAreaView edges={['top']}>
        <HStack space='sm' className='items-center px-4 pt-2 pb-1'>
          <TouchableOpacity onPress={() => router.back()} className='bg-background-0 p-2 rounded-xl'>
            <Ionicons name='chevron-back' size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
          </TouchableOpacity>
          <SearchText
            className='flex-1'
            value={term}
            onTextChange={setTerm}
            placeholder={t('screen.search.placeholder')}
            autoFocus
          />
        </HStack>
      </SafeAreaView>

      <FlatList
        data={products}
        keyExtractor={(item) => item.product.id}
        contentContainerStyle={{ padding: 16, gap: 12, flexGrow: 1 }}
        keyboardShouldPersistTaps='handled'
        renderItem={({ item }) => (
          <ProductCard
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
            <Center className='flex-1 py-16'><Spinner /></Center>
          ) : (
            <Center className='flex-1 py-16'>
              <Text className='text-typography-600 text-center'>
                {enabled ? t('screen.search.empty') : t('screen.search.minChars')}
              </Text>
            </Center>
          )
        }
        ListFooterComponent={isFetchingNextPage ? <Center className='py-4'><Spinner /></Center> : null}
      />
    </VStack>
  );
}
