import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
} from "@/components/ui/actionsheet";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Center } from "@/components/ui/center";
import { Badge, BadgeText } from "@/components/ui/badge";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from "react-i18next";
import { useLists } from "@/hooks/screens/useLists";
import { AddToListModalProps } from "./types/add-to-list-modal";

const roleAction = {
  owner: 'success',
  editor: 'info',
  reader: 'muted',
} as const;

const AddToListModal = ({ isOpen, onClose, onSelect }: AddToListModalProps) => {
  const { t } = useTranslation();
  const { lists } = useLists();

  const editableLists = lists.filter((list) => list.myRole !== 'reader');

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent className="pb-6">
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>

        <VStack className="w-full px-2 pt-3 pb-1">
          <Heading size="md">{t('screen.lists.addToList')}</Heading>
          <Text className="text-sm text-typography-600">{t('screen.lists.addToListSubtitle')}</Text>
        </VStack>

        {editableLists.length === 0 ? (
          <Center className="w-full py-8">
            <Text className="text-typography-600">{t('screen.lists.empty')}</Text>
          </Center>
        ) : (
          editableLists.map((list) => (
            <ActionsheetItem
              key={list.id}
              onPress={() => onSelect(list.id)}
              className="rounded-2xl py-3"
            >
              <HStack className="flex-1 items-center" space="md">
                <Center className="h-11 w-11 rounded-xl bg-primary-500/10">
                  <Ionicons name="cart-outline" size={22} color="#e44b5e" />
                </Center>
                <VStack className="flex-1">
                  <Heading className="text-[15px] font-semibold" numberOfLines={1}>
                    {list.name}
                  </Heading>
                  <Text className="text-sm text-typography-600">
                    {t('screen.lists.itemCount', { count: list.itemCount })}
                  </Text>
                </VStack>
                <Badge size="sm" action={roleAction[list.myRole]} className="rounded-full">
                  <BadgeText className="capitalize">{t(`role.${list.myRole}`)}</BadgeText>
                </Badge>
              </HStack>
            </ActionsheetItem>
          ))
        )}
      </ActionsheetContent>
    </Actionsheet>
  );
};

export default AddToListModal;
