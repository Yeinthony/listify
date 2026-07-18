import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetFlatList,
  ActionsheetItem,
} from "@/components/ui/actionsheet";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { ListRenderItem } from "react-native";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { SearchText } from "@/components/inputs/SearchText";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { StoreOption, StoreSelectModalProps } from "./types/store-select-modal";

const StoreSelectModal = ({ isOpen, onClose, stores, selectedStoreId, onSelect }: StoreSelectModalProps) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? stores.filter((s) => s.name.toLowerCase().includes(q)) : stores;
  }, [stores, query]);

  const select = (storeId: string | null) => {
    onSelect(storeId);
    onClose();
  };

  const renderItem: ListRenderItem<StoreOption> = ({ item }) => (
    <ActionsheetItem
      onPress={() => select(item.storeId)}
      className={`rounded-2xl py-3 ${selectedStoreId === item.storeId ? 'bg-primary-500/10' : ''}`}
    >
      <Text numberOfLines={1} className={`text-sm ${selectedStoreId === item.storeId ? 'text-primary-600 font-semibold' : 'font-medium'}`}>
        {item.name}
      </Text>
    </ActionsheetItem>
  );

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent className="pb-6">
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>

        <KeyboardAvoidingView behavior="padding" style={{ width: '100%' }}>
          <VStack className="w-full px-2 pt-3">
            <Heading size="md">{t('screen.lists.store')}</Heading>
            <SearchText
              value={query}
              onTextChange={setQuery}
              className="bg-background-100 border-outline-200"
            />
          </VStack>

          {!query && (
            <ActionsheetItem
              onPress={() => select(null)}
              className={`rounded-2xl py-3 ${!selectedStoreId ? 'bg-primary-500/10' : ''}`}
            >
              <Text className={`text-sm ${!selectedStoreId ? 'text-primary-600 font-semibold' : 'font-medium'}`}>
                {t('screen.lists.allStores')}
              </Text>
            </ActionsheetItem>
          )}

          <ActionsheetFlatList
            data={filtered}
            keyExtractor={(item) => (item as StoreOption).storeId}
            renderItem={renderItem as ListRenderItem<unknown>}
            keyboardShouldPersistTaps="handled"
            initialNumToRender={12}
            windowSize={10}
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: 360, width: '100%' }}
          />
        </KeyboardAvoidingView>
      </ActionsheetContent>
    </Actionsheet>
  );
};

export default StoreSelectModal;
