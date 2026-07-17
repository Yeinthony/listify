import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Center } from '@/components/ui/center';
import { Spinner } from '@/components/ui/spinner';
import { Menu, MenuItem, MenuItemLabel } from '@/components/ui/menu';
import { AppleMaps, GoogleMaps } from 'expo-maps';
import { Platform, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Motion, AnimatePresence } from '@legendapp/motion';
import { useListOptimizer } from '@/hooks/screens/useListOptimizer';
import { useListDetail } from '@/hooks/screens/useListDetail';
import { DISTANCES_FILTER } from '@/assets/globalsConst';
import { requestCurrentCoords, Coords } from '@/utils/location';
import { BranchMapMarker } from '@/components/modals/types/branchs-map';
import { PlannedStore } from '@/types/shopping-lists';
import MapLoadingOverlay from '@/components/generals/MapLoadingOverlay';
import PlannedStoreDetailModal from '@/components/modals/PlannedStoreDetailModal';

const MotionView = Motion.View as any;

const money = (n: number) => `$${Math.round(n).toLocaleString('es-AR')}`;

const ZOOM_BY_KM: Record<number, number> = {
  1: 14, 2.5: 13, 5: 12, 10: 11, 20: 10, 40: 9, 80: 8, 160: 7, 320: 6, 640: 5, 900: 4,
};

export default function ListOptimizer() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id || '';

  const { optimize, result, optimizing } = useListOptimizer(id);
  const { list } = useListDetail(id);

  const [km, setKm] = useState<number>(5);
  const [maxStores, setMaxStores] = useState<number>(1);
  const [coords, setCoords] = useState<Coords | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [chosen, setChosen] = useState<PlannedStore | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [focus, setFocus] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    (async () => {
      const res = await requestCurrentCoords();
      if (res.status !== 'granted') {
        setPermissionDenied(true);
        return;
      }
      setCoords(res.coords);
    })();
  }, []);

  const productNameById = useMemo(() => {
    const map: Record<string, string> = {};
    (list?.items ?? []).forEach((it) => { map[it.product.id] = it.product.name; });
    return map;
  }, [list?.items]);

  const stores = result?.stores ?? [];
  const totalItems = list?.items.length ?? 0;

  const markers = useMemo<BranchMapMarker[]>(() =>
    stores
      .filter((s) => s.latitude != null && s.longitude != null)
      .map((s) => ({
        id: s.branchId,
        coordinates: { latitude: s.latitude as number, longitude: s.longitude as number },
        title: money(s.subtotalWithDiscount),
        snippet: s.storeName,
        tintColor: '#e44b5e',
      })),
    [stores],
  );

  const camera = focus ?? coords;
  const zoom = ZOOM_BY_KM[km] ?? 12;

  const onSelectStore = (store: PlannedStore) => {
    setChosen(store);
    if (store.latitude != null && store.longitude != null) {
      setFocus({ lat: store.latitude, lng: store.longitude });
    }
    setShowDetail(true);
  };

  const onMarkerClick = (marker: { id?: string }) => {
    const store = stores.find((s) => s.branchId === marker.id);
    if (store) onSelectStore(store);
  };

  const runOptimize = () => {
    if (!coords) return;
    setChosen(null);
    setFocus(null);
    optimize({ km, maxStores, lat: coords.lat, lng: coords.lng });
  };

  const showOverlay = !coords && !permissionDenied;

  if (permissionDenied) {
    return (
      <VStack className='flex-1 bg-background-100'>
        <SafeAreaView className='flex-1'>
          <HStack className='mx-4 mt-2'>
            <TouchableOpacity onPress={() => router.back()} className='bg-background-0 p-2 rounded-xl'>
              <Ionicons name='chevron-back' size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
            </TouchableOpacity>
          </HStack>
          <Center className='flex-1 px-10'>
            <Center className='h-20 w-20 rounded-full bg-primary-500/10 mb-4'>
              <Ionicons name='location-outline' size={34} color='#e44b5e' />
            </Center>
            <Text className='text-typography-600 text-center'>{t('screen.lists.locationDenied')}</Text>
          </Center>
        </SafeAreaView>
      </VStack>
    );
  }

  return (
    <VStack className='flex-1 bg-background-100'>
      {camera && Platform.OS === 'ios' && (
        <AppleMaps.View
          style={StyleSheet.absoluteFill}
          cameraPosition={{ coordinates: { latitude: camera.lat, longitude: camera.lng }, zoom }}
          markers={markers}
          onMarkerClick={onMarkerClick}
        />
      )}
      {camera && Platform.OS !== 'ios' && (
        <GoogleMaps.View
          style={StyleSheet.absoluteFill}
          cameraPosition={{ coordinates: { latitude: camera.lat, longitude: camera.lng }, zoom }}
          properties={{ isMyLocationEnabled: true }}
          uiSettings={{ myLocationButtonEnabled: false, zoomControlsEnabled: false }}
          markers={markers}
          onMarkerClick={onMarkerClick}
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
            <Heading size='xs' className='uppercase'>{t('screen.lists.optimize')}</Heading>
          </Center>
        </HStack>

        <VStack className='flex-1' />

        <VStack className='w-[92%] bg-background-0/95 mx-auto mb-8 px-4 py-4 rounded-2xl' space='md' style={{ borderCurve: 'continuous' }}>
          {result && !optimizing && (
            <>
              {stores.length === 0 ? (
                <Text className='text-typography-600 text-center'>{t('screen.lists.noPlan')}</Text>
              ) : (
                <>
                  <HStack className='items-center justify-between'>
                    <VStack>
                      <Text className='text-typography-600 text-xs'>{t('screen.lists.total')}</Text>
                      <Heading className='text-xl font-extrabold' style={{ fontVariant: ['tabular-nums'] }}>{money(result.totalCost)}</Heading>
                    </VStack>
                    <VStack className='items-center'>
                      <Text className='text-typography-600 text-xs'>{t('screen.lists.savings')}</Text>
                      <Heading className='text-xl font-extrabold text-success-500' style={{ fontVariant: ['tabular-nums'] }}>{money(result.savings)}</Heading>
                    </VStack>
                    <VStack className='items-end'>
                      <Text className='text-typography-600 text-xs'>{t('screen.lists.coverage')}</Text>
                      <Heading className='text-xl font-extrabold' style={{ fontVariant: ['tabular-nums'] }}>
                        {`${result.coveredItems}/${totalItems}`}
                      </Heading>
                    </VStack>
                  </HStack>

                  <VStack space='xs'>
                    {stores.map((store) => (
                      <TouchableOpacity key={store.branchId} onPress={() => onSelectStore(store)}>
                        <HStack className='items-center bg-background-100 rounded-xl px-3 py-2' space='sm'>
                          <Center className='h-8 w-8 rounded-lg bg-primary-500/10'>
                            <Ionicons name='storefront-outline' size={16} color='#e44b5e' />
                          </Center>
                          <VStack className='flex-1'>
                            <Text className='text-sm font-medium' numberOfLines={1}>{store.storeName}</Text>
                            <Text className='text-xs text-typography-500'>
                              {`${(store.distanceMeters / 1000).toFixed(1)} km · ${t('screen.lists.itemCount', { count: store.items.length })}`}
                            </Text>
                          </VStack>
                          <Text className='text-sm font-bold text-primary-600' style={{ fontVariant: ['tabular-nums'] }}>
                            {money(store.subtotalWithDiscount)}
                          </Text>
                        </HStack>
                      </TouchableOpacity>
                    ))}
                  </VStack>

                  {result.notCovered.length > 0 && (
                    <HStack className='items-center' space='xs'>
                      <Ionicons name='alert-circle-outline' size={16} color='#E63535' />
                      <Text className='text-xs text-error-500'>
                        {`${t('screen.lists.notCovered')}: ${result.notCovered.length}`}
                      </Text>
                    </HStack>
                  )}
                </>
              )}
            </>
          )}

          {!result && !optimizing && (
            <Text className='text-typography-500 text-center text-sm'>{t('screen.lists.optimizeHint')}</Text>
          )}

          <HStack space='sm' className='items-center'>
            <Menu
              placement='top'
              offset={5}
              closeOnSelect
              trigger={({ ...triggerProps }) => (
                <TouchableOpacity {...triggerProps}>
                  <HStack space='xs' className='items-center bg-primary-500/20 px-3 py-2 rounded-full border-[1px] border-primary-500'>
                    <Ionicons name='navigate-outline' size={14} color='#e44b5e' />
                    <Text className='text-sm text-primary-500'>{km} km</Text>
                    <Ionicons name='chevron-down-outline' size={14} color='#e44b5e' />
                  </HStack>
                </TouchableOpacity>
              )}
            >
              {DISTANCES_FILTER.map((d) => (
                <MenuItem key={d} textValue={d.toString()} className={`justify-center ${km === d && 'bg-primary-500/20'}`} onPress={() => setKm(d)}>
                  <MenuItemLabel size='sm' className={`${km === d && 'text-primary-500'}`}>{d} km</MenuItemLabel>
                </MenuItem>
              ))}
            </Menu>

            <HStack className='flex-1 items-center justify-end' space='md'>
              <Text className='text-sm text-typography-600'>{t('screen.lists.maxStores')}</Text>
              <TouchableOpacity
                onPress={() => setMaxStores((s) => Math.max(1, s - 1))}
                className='bg-background-100 h-9 w-9 rounded-full items-center justify-center'
              >
                <Ionicons name='remove' size={18} color='#6b7280' />
              </TouchableOpacity>
              <Text className='text-lg font-extrabold w-5 text-center' style={{ fontVariant: ['tabular-nums'] }}>{maxStores}</Text>
              <TouchableOpacity
                onPress={() => setMaxStores((s) => s + 1)}
                className='bg-background-100 h-9 w-9 rounded-full items-center justify-center'
              >
                <Ionicons name='add' size={18} color='#6b7280' />
              </TouchableOpacity>
            </HStack>
          </HStack>

          <TouchableOpacity onPress={runOptimize} disabled={optimizing || !coords}>
            <Center className={`bg-primary-500 rounded-2xl h-12 ${optimizing || !coords ? 'opacity-60' : ''}`} style={{ borderCurve: 'continuous' }}>
              {optimizing ? (
                <Spinner color='white' />
              ) : (
                <Text className='text-white font-medium'>{t('screen.lists.runOptimize')}</Text>
              )}
            </Center>
          </TouchableOpacity>
        </VStack>
      </SafeAreaView>

      <PlannedStoreDetailModal
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        store={chosen}
        productNameById={productNameById}
        totalItems={totalItems}
      />

      <AnimatePresence>
        {showOverlay && (
          <MotionView
            key='map-loading'
            style={StyleSheet.absoluteFill}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'timing', duration: 350 }}
          >
            <MapLoadingOverlay phase='locating' title={t('screen.lists.optimize')} onBack={() => router.back()} />
          </MotionView>
        )}
      </AnimatePresence>
    </VStack>
  );
}
