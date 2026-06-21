import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '@/components/generals/CustomHeader';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
import { Spinner } from '@/components/ui/spinner';
import { ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useListOptimizer } from '@/hooks/screens/useListOptimizer';
import { DISTANCES_FILTER } from '@/assets/globalsConst';

const money = (n: number) => `$${Math.round(n).toLocaleString('es-AR')}`;

export default function ListOptimizer() {
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id || '';

  const { optimize, result, optimizing } = useListOptimizer(id);

  const [km, setKm] = useState<number>(5);
  const [maxStores, setMaxStores] = useState<number>(1);

  return (
    <VStack className='flex-1 bg-background-100'>
      <VStack className='w-full pb-4 bg-primary-500 rounded-b-[15%]'>
        <SafeAreaView>
          <CustomHeader title={t('screen.lists.optimize')} white />
        </SafeAreaView>
      </VStack>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <VStack space='sm'>
          <Text className='font-medium'>{t('screen.lists.radiusKm')}</Text>
          <HStack space='sm' className='flex-wrap'>
            {DISTANCES_FILTER.map((d) => (
              <TouchableOpacity
                key={d}
                onPress={() => setKm(d)}
                className={`px-4 py-2 rounded-full ${km === d ? 'bg-primary-500' : 'bg-background-0'}`}
              >
                <Text className={km === d ? 'text-white' : ''}>{d} km</Text>
              </TouchableOpacity>
            ))}
          </HStack>
        </VStack>

        <VStack space='sm'>
          <Text className='font-medium'>{t('screen.lists.maxStores')}</Text>
          <HStack className='items-center' space='xl'>
            <TouchableOpacity
              onPress={() => setMaxStores((s) => Math.max(1, s - 1))}
              className='bg-background-0 h-12 w-12 rounded-full items-center justify-center'
            >
              <Ionicons name="remove" size={22} color="#6b7280" />
            </TouchableOpacity>
            <Text className='text-2xl font-extrabold' style={{ fontVariant: ['tabular-nums'] }}>
              {maxStores}
            </Text>
            <TouchableOpacity
              onPress={() => setMaxStores((s) => s + 1)}
              className='bg-background-0 h-12 w-12 rounded-full items-center justify-center'
            >
              <Ionicons name="add" size={22} color="#6b7280" />
            </TouchableOpacity>
          </HStack>
        </VStack>

        <TouchableOpacity
          onPress={() => optimize({ km, maxStores })}
          disabled={optimizing}
        >
          <Center className='bg-primary-500 rounded-2xl h-14'>
            <Text className='text-white font-medium'>{t('screen.lists.runOptimize')}</Text>
          </Center>
        </TouchableOpacity>

        {optimizing && (
          <Center className='py-6'>
            <Spinner />
          </Center>
        )}

        {result && !optimizing && (
          <VStack space='md'>
            <HStack className='bg-background-0 rounded-2xl p-4 justify-between'>
              <VStack>
                <Text className='text-typography-600 text-sm'>{t('screen.lists.total')}</Text>
                <Heading className='text-xl font-extrabold'>{money(result.totalCost)}</Heading>
              </VStack>
              <VStack className='items-end'>
                <Text className='text-typography-600 text-sm'>{t('screen.lists.savings')}</Text>
                <Heading className='text-xl font-extrabold text-success-500'>{money(result.savings)}</Heading>
              </VStack>
            </HStack>

            {result.stores.map((store) => (
              <VStack key={store.branchId} className='bg-background-0 rounded-2xl p-4' space='sm'>
                <HStack className='justify-between items-center'>
                  <Heading className='text-[15px] font-bold'>{store.storeName}</Heading>
                  <Text className='font-extrabold'>{money(store.subtotalWithDiscount)}</Text>
                </HStack>
                <Text className='text-sm text-typography-600'>
                  {`${(store.distanceMeters / 1000).toFixed(2)} km · ${t('screen.lists.itemCount', { count: store.items.length })}`}
                </Text>
                {store.appliedDiscount && (
                  <Text className='text-sm text-success-500'>
                    {`-${money(store.appliedDiscount.amount)} (${store.appliedDiscount.paymentMethod})`}
                  </Text>
                )}
              </VStack>
            ))}

            {result.notCovered.length > 0 && (
              <VStack className='bg-background-0 rounded-2xl p-4' space='sm'>
                <Heading className='text-[15px] font-bold text-error-500'>
                  {t('screen.lists.notCovered')}
                </Heading>
                <Divider />
                {result.notCovered.map((item) => (
                  <Text key={item.productId} className='text-sm'>
                    {item.name ?? item.productId}
                  </Text>
                ))}
              </VStack>
            )}
          </VStack>
        )}
      </ScrollView>
    </VStack>
  );
}
