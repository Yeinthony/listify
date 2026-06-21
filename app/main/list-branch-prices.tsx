import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Center } from '@/components/ui/center';
import { Spinner } from '@/components/ui/spinner';
import { AppleMaps, GoogleMaps } from 'expo-maps';
import { FlatList, Platform, ScrollView, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useListBranchPrices } from '@/hooks/screens/useListBranchPrices';
import { useListDetail } from '@/hooks/screens/useListDetail';
import { DISTANCES_FILTER } from '@/assets/globalsConst';
import { BranchMapMarker } from '@/components/modals/types/branchs-map';
import { BranchPriceEntry } from '@/types/shopping-lists';
import BranchPriceDetailModal from '@/components/modals/BranchPriceDetailModal';

const money = (n: number) => `$${Math.round(n).toLocaleString('es-AR')}`;

export default function ListBranchPrices() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id || '';

  const [km, setKm] = useState<number>(5);
  const [selected, setSelected] = useState<BranchPriceEntry | null>(null);
  const [focus, setFocus] = useState<{ lat: number; lng: number } | null>(null);

  const { coords, permissionDenied, branches, totalItems, loading } = useListBranchPrices(id, km);
  const { list } = useListDetail(id);

  const productNameById = useMemo(() => {
    const map: Record<string, string> = {};
    (list?.items ?? []).forEach((it) => { map[it.product.id] = it.product.name; });
    return map;
  }, [list?.items]);

  const markers = useMemo<BranchMapMarker[]>(() =>
    branches
      .filter((b) => b.latitude != null && b.longitude != null)
      .map((b) => ({
        coordinates: { latitude: b.latitude as number, longitude: b.longitude as number },
        title: money(b.totalWithDiscount),
        snippet: b.storeName,
      })),
    [branches],
  );

  const camera = focus ?? coords;

  const onSelectBranch = (branch: BranchPriceEntry) => {
    setSelected(branch);
    if (branch.latitude != null && branch.longitude != null) {
      setFocus({ lat: branch.latitude, lng: branch.longitude });
    }
  };

  return (
    <VStack className='flex-1 bg-background-100'>
      {camera && Platform.OS === 'ios' && (
        <AppleMaps.View style={StyleSheet.absoluteFill} />
      )}
      {camera && Platform.OS !== 'ios' && (
        <GoogleMaps.View
          style={StyleSheet.absoluteFill}
          cameraPosition={{
            coordinates: { latitude: camera.lat, longitude: camera.lng },
            zoom: 13,
          }}
          properties={{ isMyLocationEnabled: true }}
          uiSettings={{ myLocationButtonEnabled: false, zoomControlsEnabled: false }}
          markers={markers}
          circles={[{
            center: { latitude: coords!.lat, longitude: coords!.lng },
            radius: km * 1000,
            color: 'rgba(228, 75, 94, 0.1)',
            lineColor: '#e44b5e',
            lineWidth: 2,
          }]}
        />
      )}

      <SafeAreaView className='flex-1' pointerEvents='box-none'>
        <HStack space='md' className='items-center mx-4'>
          <TouchableOpacity onPress={() => router.back()} className='bg-background-0 p-2 rounded-xl'>
            <Ionicons name='chevron-back' size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
          </TouchableOpacity>
          <Center className='bg-background-0/90 rounded-xl px-4 py-2 flex-1'>
            <Heading size='xs' className='uppercase'>{t('screen.lists.branchPrices')}</Heading>
          </Center>
        </HStack>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}
        >
          {DISTANCES_FILTER.map((d) => (
            <TouchableOpacity
              key={d}
              onPress={() => setKm(d)}
              className={`px-3 py-1.5 rounded-full ${km === d ? 'bg-primary-500' : 'bg-background-0/90'}`}
            >
              <Text className={km === d ? 'text-white text-sm' : 'text-sm'}>{d} km</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <VStack className='flex-1' />

        {loading && (
          <Center className='mb-4'>
            <Center className='bg-background-0/90 rounded-full h-12 w-12'>
              <Spinner />
            </Center>
          </Center>
        )}

        {!loading && permissionDenied && (
          <Center className='mx-4 mb-6 bg-background-0/90 rounded-2xl p-4'>
            <Text className='text-typography-600 text-center'>{t('screen.lists.locationDenied')}</Text>
          </Center>
        )}

        {!loading && !permissionDenied && branches.length === 0 && (
          <Center className='mx-4 mb-6 bg-background-0/90 rounded-2xl p-4'>
            <Text className='text-typography-600 text-center'>{t('screen.lists.noBranches')}</Text>
          </Center>
        )}

        {branches.length > 0 && (
          <FlatList
            data={branches}
            horizontal
            keyExtractor={(b) => b.branchId}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8, gap: 12 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => onSelectBranch(item)}
                className={`bg-background-0 rounded-2xl p-4 w-64 ${selected?.branchId === item.branchId ? 'border-[1.5px] border-primary-500' : ''}`}
              >
                <Heading className='text-[15px] font-bold uppercase' numberOfLines={1}>
                  {item.storeName}
                </Heading>
                <Text className='text-sm text-typography-600' numberOfLines={1}>
                  {[item.branchName, `${(item.distanceMeters / 1000).toFixed(1)} km`].filter(Boolean).join(' · ')}
                </Text>
                <HStack className='items-end justify-between mt-2'>
                  <Text className='text-xs text-typography-500'>
                    {t('screen.lists.available', { covered: item.coveredItems, total: totalItems })}
                  </Text>
                  <Heading className='text-xl font-extrabold text-primary-600' style={{ fontVariant: ['tabular-nums'] }}>
                    {money(item.totalWithDiscount)}
                  </Heading>
                </HStack>
              </TouchableOpacity>
            )}
          />
        )}
      </SafeAreaView>

      <BranchPriceDetailModal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        branch={selected}
        productNameById={productNameById}
        totalItems={totalItems}
      />
    </VStack>
  );
}
