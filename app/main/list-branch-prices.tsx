import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Center } from '@/components/ui/center';
import { Spinner } from '@/components/ui/spinner';
import { Menu, MenuItem, MenuItemLabel } from '@/components/ui/menu';
import MapView, { Circle, Marker } from 'react-native-maps';
import { StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useListBranchPrices } from '@/hooks/screens/useListBranchPrices';
import { regionForKm } from '@/utils/mapRegion';
import { useListDetail } from '@/hooks/screens/useListDetail';
import { CHANNELS_FILTER, DEFAULT_CHANNEL, DISTANCES_FILTER, LIMITS_FILTER, LimitFilter } from '@/assets/globalsConst';
import { BranchChannel } from '@/api/types/shopping-lists';
import { BranchMapMarker } from '@/components/modals/types/branchs-map';
import { BranchPriceEntry } from '@/types/shopping-lists';
import BranchPriceDetailModal from '@/components/modals/BranchPriceDetailModal';
import BranchSelectModal from '@/components/modals/BranchSelectModal';
import StoreSelectModal from '@/components/modals/StoreSelectModal';
import MapLoadingOverlay, { MapLoadingPhase } from '@/components/generals/MapLoadingOverlay';
import { Motion, AnimatePresence } from '@legendapp/motion';

const MotionView = Motion.View as any;

const money = (n: number) => `$${Math.round(n).toLocaleString('es-AR')}`;

const BEST_PIN = require('@/assets/images/favorite-pin.png');

export default function ListBranchPrices() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id || '';

  const [km, setKm] = useState<number>(5);
  const [channel, setChannel] = useState<BranchChannel>(DEFAULT_CHANNEL);
  const [limit, setLimit] = useState<LimitFilter>(30);
  const [storeFilter, setStoreFilter] = useState<string | null>(null);
  const [chosen, setChosen] = useState<BranchPriceEntry | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showStoreSelect, setShowStoreSelect] = useState(false);
  const [showBranchSelect, setShowBranchSelect] = useState(false);
  const [focus, setFocus] = useState<{ lat: number; lng: number } | null>(null);
  const [rendering, setRendering] = useState(false);

  const { coords, permissionDenied, branches, totalItems, loading } = useListBranchPrices(id, km, channel, limit);
  const { list } = useListDetail(id);

  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (coords && !loading) {
      setRendering(true);
      const id = setTimeout(() => setRendering(false), 900);
      return () => clearTimeout(id);
    }
  }, [coords, loading]);

  const phase: MapLoadingPhase | 'denied' | 'ready' =
    permissionDenied ? 'denied'
      : !coords ? 'locating'
        : loading ? 'fetching'
          : rendering ? 'rendering'
            : 'ready';
  const showOverlay = phase === 'locating' || phase === 'fetching' || phase === 'rendering';

  const productNameById = useMemo(() => {
    const map: Record<string, string> = {};
    (list?.items ?? []).forEach((it) => { map[it.product.id] = it.product.name; });
    return map;
  }, [list?.items]);

  const stores = useMemo(() => {
    const map = new Map<string, string>();
    branches.forEach((b) => { if (!map.has(b.storeId)) map.set(b.storeId, b.storeName); });
    return [...map.entries()]
      .map(([storeId, name]) => ({ storeId, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [branches]);

  const filteredBranches = useMemo(
    () => (storeFilter ? branches.filter((b) => b.storeId === storeFilter) : branches),
    [branches, storeFilter],
  );

  const bestBranch = useMemo(() => {
    if (filteredBranches.length === 0) return null;
    const maxCoverage = Math.max(...filteredBranches.map((b) => b.coveredItems));
    return filteredBranches
      .filter((b) => b.coveredItems === maxCoverage)
      .reduce((best, b) => (b.totalWithDiscount < best.totalWithDiscount ? b : best));
  }, [filteredBranches]);

  const selectedStoreName = stores.find((s) => s.storeId === storeFilter)?.name;

  const onSelectStore = (storeId: string | null) => {
    setStoreFilter(storeId);
    setChosen(null);
    setFocus(null);
  };

  const channelLabel = (c: BranchChannel) =>
    c === 'all' ? t('screen.lists.channelAll')
      : c === 'mayorista' ? t('screen.lists.channelMayorista')
        : t('screen.lists.channelMinorista');

  const limitLabel = (l: LimitFilter) =>
    l === 'all' ? t('screen.lists.limitAll') : String(l);

  const onSelectChannel = (c: BranchChannel) => {
    setChannel(c);
    setStoreFilter(null);
    setChosen(null);
    setFocus(null);
  };

  const onSelectLimit = (l: LimitFilter) => {
    setLimit(l);
    setChosen(null);
    setFocus(null);
  };

  const markers = useMemo<BranchMapMarker[]>(() =>
    filteredBranches
      .filter((b) => b.latitude != null && b.longitude != null)
      .map((b) => {
        const isBest = b.branchId === bestBranch?.branchId;
        return {
          id: b.branchId,
          coordinate: { latitude: b.latitude as number, longitude: b.longitude as number },
          title: `${isBest ? '⭐ ' : ''}${money(b.totalWithDiscount)}`,
          description: b.storeName,
          image: isBest ? BEST_PIN : undefined,
        };
      }),
    [filteredBranches, bestBranch],
  );

  const camera = focus ?? coords;

  const region = useMemo(
    () => (camera ? regionForKm(camera.lat, camera.lng, km) : null),
    [camera?.lat, camera?.lng, km],
  );

  useEffect(() => {
    if (region) mapRef.current?.animateToRegion(region, 350);
  }, [region]);

  const onSelectBranch = (branch: BranchPriceEntry) => {
    setChosen(branch);
    if (branch.latitude != null && branch.longitude != null) {
      setFocus({ lat: branch.latitude, lng: branch.longitude });
    }
  };

  return (
    <VStack className='flex-1 bg-background-100'>
      {region && (
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          initialRegion={region}
          showsUserLocation={true}
          showsMyLocationButton={false}
          zoomControlEnabled={false}
          toolbarEnabled={false}
        >
          {markers.map((marker) => {
            const branch = filteredBranches.find((b) => b.branchId === marker.id);
            return (
              <Marker
                key={marker.id}
                coordinate={marker.coordinate}
                title={marker.title}
                description={marker.description}
                image={marker.image}
                onPress={() => branch && onSelectBranch(branch)}
              />
            );
          })}
          {coords && (
            <Circle
              center={{ latitude: coords.lat, longitude: coords.lng }}
              radius={km * 1000}
              fillColor='rgba(228, 75, 94, 0.1)'
              strokeColor='#e44b5e'
              strokeWidth={2}
            />
          )}
        </MapView>
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

        <VStack className='flex-1' />

        <VStack className='w-[92%] bg-background-0/95 mx-auto mb-8 px-4 py-4 rounded-2xl' space='md'>
          {/* Más barato */}
          {bestBranch && (
            <TouchableOpacity
              onPress={() => { onSelectBranch(bestBranch); setShowDetail(true); }}
              className='bg-success-500/10 rounded-2xl p-3 flex-row items-center'
              style={{ borderCurve: 'continuous' }}
            >
              <Center className='h-10 w-10 rounded-xl bg-success-500'>
                <Ionicons name='star' size={18} color='white' />
              </Center>
              <VStack className='flex-1 ml-3'>
                <Text className='text-xs font-bold text-success-600'>{t('screen.lists.cheapest')}</Text>
                <Text className='text-sm' numberOfLines={1}>
                  {`${bestBranch.storeName} · ${(bestBranch.distanceMeters / 1000).toFixed(1)} km`}
                </Text>
              </VStack>
              <Heading className='text-lg font-extrabold text-success-600' style={{ fontVariant: ['tabular-nums'] }}>
                {money(bestBranch.totalWithDiscount)}
              </Heading>
              <Ionicons name='chevron-forward' size={18} color='#16a34a' />
            </TouchableOpacity>
          )}

          {/* Comercio + distancia (misma línea) */}
          <HStack space='sm' className='items-center'>
            <TouchableOpacity className='flex-1' onPress={() => setShowStoreSelect(true)}>
              <HStack space='xs' className='items-center bg-primary-500/20 px-3 py-2 rounded-full border-[1px] border-primary-500'>
                <Ionicons name='storefront-outline' size={14} color='#e44b5e' />
                <Text className='text-sm text-primary-500 flex-1' numberOfLines={1}>
                  {selectedStoreName ?? t('screen.lists.allStores')}
                </Text>
                <Ionicons name='chevron-down-outline' size={14} color='#e44b5e' />
              </HStack>
            </TouchableOpacity>

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
                <MenuItem
                  key={d}
                  textValue={d.toString()}
                  className={`justify-center ${km === d && 'bg-primary-500/20'}`}
                  onPress={() => setKm(d)}
                >
                  <MenuItemLabel size='sm' className={`${km === d && 'text-primary-500'}`}>{d} km</MenuItemLabel>
                </MenuItem>
              ))}
            </Menu>
          </HStack>

          {/* Canal + límite (misma línea) */}
          <HStack space='sm' className='items-center'>
            <Menu
              placement='top'
              offset={5}
              closeOnSelect
              trigger={({ ...triggerProps }) => (
                <TouchableOpacity className='flex-1' {...triggerProps}>
                  <HStack space='xs' className='items-center justify-center bg-primary-500/20 px-3 py-2 rounded-full border-[1px] border-primary-500'>
                    <Ionicons name='pricetags-outline' size={14} color='#e44b5e' />
                    <Text className='text-sm text-primary-500'>{channelLabel(channel)}</Text>
                    <Ionicons name='chevron-down-outline' size={14} color='#e44b5e' />
                  </HStack>
                </TouchableOpacity>
              )}
            >
              {CHANNELS_FILTER.map((c) => (
                <MenuItem
                  key={c}
                  textValue={c}
                  className={`justify-center ${channel === c && 'bg-primary-500/20'}`}
                  onPress={() => onSelectChannel(c)}
                >
                  <MenuItemLabel size='sm' className={`${channel === c && 'text-primary-500'}`}>{channelLabel(c)}</MenuItemLabel>
                </MenuItem>
              ))}
            </Menu>

            <Menu
              placement='top'
              offset={5}
              closeOnSelect
              style={{ maxHeight: 360 }}
              trigger={({ ...triggerProps }) => (
                <TouchableOpacity {...triggerProps}>
                  <HStack space='xs' className='items-center bg-primary-500/20 px-3 py-2 rounded-full border-[1px] border-primary-500'>
                    <Ionicons name='layers-outline' size={14} color='#e44b5e' />
                    <Text className='text-sm text-primary-500'>{limitLabel(limit)}</Text>
                    <Ionicons name='chevron-down-outline' size={14} color='#e44b5e' />
                  </HStack>
                </TouchableOpacity>
              )}
            >
              {LIMITS_FILTER.map((l) => (
                <MenuItem
                  key={l}
                  textValue={l.toString()}
                  className={`justify-center ${limit === l && 'bg-primary-500/20'}`}
                  onPress={() => onSelectLimit(l)}
                >
                  <MenuItemLabel size='sm' className={`${limit === l && 'text-primary-500'}`}>{limitLabel(l)}</MenuItemLabel>
                </MenuItem>
              ))}
            </Menu>
          </HStack>

          {/* Select de comercio + sucursal */}
          {loading ? (
            <Center className='py-3'><Spinner /></Center>
          ) : permissionDenied ? (
            <Text className='text-typography-600 text-center'>{t('screen.lists.locationDenied')}</Text>
          ) : branches.length === 0 ? (
            <Text className='text-typography-600 text-center'>{t('screen.lists.noBranches')}</Text>
          ) : (
            <>
              <TouchableOpacity onPress={() => setShowBranchSelect(true)}>
                <HStack className='items-center justify-between bg-background-100 px-4 h-12 rounded-2xl'>
                  <Text className='flex-1' numberOfLines={1}>
                    {chosen ? chosen.storeName : t('screen.lists.selectBranch')}
                  </Text>
                  <Ionicons name='chevron-down-outline' size={18} color='#6b7280' />
                </HStack>
              </TouchableOpacity>

              {chosen && (
                <TouchableOpacity onPress={() => setShowDetail(true)}>
                  <HStack className='items-center justify-between bg-primary-500/10 rounded-2xl p-4'>
                    <VStack className='flex-1'>
                      <Text className='text-xs text-typography-600'>
                        {t('screen.lists.available', { covered: chosen.coveredItems, total: totalItems })}
                      </Text>
                      <Heading className='text-xl font-extrabold text-primary-600' style={{ fontVariant: ['tabular-nums'] }}>
                        {money(chosen.totalWithDiscount)}
                      </Heading>
                    </VStack>
                    <HStack space='xs' className='items-center'>
                      <Text className='text-sm text-primary-600 font-medium'>{t('screen.lists.viewDetail')}</Text>
                      <Ionicons name='chevron-forward' size={18} color='#e44b5e' />
                    </HStack>
                  </HStack>
                </TouchableOpacity>
              )}
            </>
          )}
        </VStack>
      </SafeAreaView>

      <StoreSelectModal
        isOpen={showStoreSelect}
        onClose={() => setShowStoreSelect(false)}
        stores={stores}
        selectedStoreId={storeFilter}
        onSelect={onSelectStore}
      />

      <BranchSelectModal
        isOpen={showBranchSelect}
        onClose={() => setShowBranchSelect(false)}
        branches={filteredBranches}
        bestBranchId={bestBranch?.branchId}
        chosenId={chosen?.branchId}
        onSelect={onSelectBranch}
      />

      <BranchPriceDetailModal
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        branch={chosen}
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
            <MapLoadingOverlay phase={phase as MapLoadingPhase} onBack={() => router.back()} />
          </MotionView>
        )}
      </AnimatePresence>
    </VStack>
  );
}
