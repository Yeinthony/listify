import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { VStack } from "../ui/vstack";
import { HStack } from "../ui/hstack";
import { Center } from "../ui/center";
import { Heading } from "../ui/heading";
import { Text } from "../ui/text";
import { Spinner } from "../ui/spinner";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from "react-i18next";

export type MapLoadingPhase = 'locating' | 'fetching' | 'rendering';

interface MapLoadingOverlayProps {
  phase: MapLoadingPhase;
  onBack: () => void;
}

const FETCHING_KEYS = [
  'screen.lists.loadingFetching1',
  'screen.lists.loadingFetching2',
  'screen.lists.loadingFetching3',
];

export default function MapLoadingOverlay({ phase, onBack }: MapLoadingOverlayProps) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (phase !== 'fetching') {
      setIdx(0);
      return;
    }
    const id = setInterval(() => setIdx((i) => (i + 1) % FETCHING_KEYS.length), 2200);
    return () => clearInterval(id);
  }, [phase]);

  const message =
    phase === 'locating'
      ? t('screen.lists.loadingLocating')
      : phase === 'rendering'
        ? t('screen.lists.loadingRendering')
        : t(FETCHING_KEYS[idx]);

  return (
    <VStack className="bg-background-100" style={StyleSheet.absoluteFill}>
      <SafeAreaView>
        <HStack className="mx-4 mt-2">
          <TouchableOpacity onPress={onBack} className="bg-background-0 p-2 rounded-xl">
            <Ionicons name="chevron-back" size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
          </TouchableOpacity>
        </HStack>
      </SafeAreaView>

      <Center className="flex-1 px-10">
        <Center className="h-20 w-20 rounded-full bg-primary-500/10 mb-6">
          <Ionicons name="storefront-outline" size={36} color="#e44b5e" />
        </Center>
        <Spinner />
        <Heading className="text-center text-lg font-bold mt-5">
          {t('screen.lists.branchPrices')}
        </Heading>
        <Text className="text-center text-typography-600 mt-2">
          {message}
        </Text>
      </Center>
    </VStack>
  );
}
