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
import { HStack } from "@/components/ui/hstack";
import { ListRenderItem } from "react-native";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { SearchText } from "@/components/inputs/SearchText";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { BranchPriceEntry } from "@/types/shopping-lists";
import { BranchSelectModalProps } from "./types/branch-select-modal";

const money = (n: number) => `$${Math.round(n).toLocaleString('es-AR')}`;

const BranchSelectModal = ({ isOpen, onClose, branches, bestBranchId, chosenId, onSelect }: BranchSelectModalProps) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? branches.filter((b) =>
        b.storeName.toLowerCase().includes(q) ||
        (b.branchName?.toLowerCase().includes(q) ?? false))
      : branches;
  }, [branches, query]);

  const renderItem: ListRenderItem<BranchPriceEntry> = ({ item }) => {
    const isBest = item.branchId === bestBranchId;
    const isChosen = item.branchId === chosenId;
    return (
      <ActionsheetItem
        onPress={() => { onSelect(item); onClose(); }}
        className={`rounded-2xl py-3 ${isChosen ? 'bg-primary-500/10' : ''}`}
      >
        <HStack className="flex-1 items-center" space="md">
          <VStack className="flex-1">
            <Text numberOfLines={1} className={`text-sm ${isBest ? 'text-success-600 font-bold' : 'font-medium'}`}>
              {`${isBest ? '⭐ ' : ''}${item.storeName}`}
            </Text>
            <Text className="text-xs text-typography-600" style={{ fontVariant: ['tabular-nums'] }}>
              {`${(item.distanceMeters / 1000).toFixed(1)} km`}
            </Text>
          </VStack>
          <Text
            className={`text-sm font-bold ${isBest ? 'text-success-600' : 'text-primary-600'}`}
            style={{ fontVariant: ['tabular-nums'] }}
          >
            {money(item.totalWithDiscount)}
          </Text>
        </HStack>
      </ActionsheetItem>
    );
  };

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent className="pb-6">
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>

        <KeyboardAvoidingView behavior="padding" style={{ width: '100%' }}>
          <VStack className="w-full px-2 pt-3">
            <Heading size="md">{t('screen.lists.selectBranch')}</Heading>
            <SearchText
              value={query}
              onTextChange={setQuery}
              className="bg-background-100 border-outline-200"
            />
          </VStack>

          <ActionsheetFlatList
            data={filtered}
            keyExtractor={(item) => (item as BranchPriceEntry).branchId}
            renderItem={renderItem as ListRenderItem<unknown>}
            keyboardShouldPersistTaps="handled"
            initialNumToRender={12}
            windowSize={10}
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: 420, width: '100%' }}
          />
        </KeyboardAvoidingView>
      </ActionsheetContent>
    </Actionsheet>
  );
};

export default BranchSelectModal;
