import { HStack } from "../ui/hstack";
import { VStack } from "../ui/vstack";
import { Heading } from "../ui/heading";
import { Text } from "../ui/text";
import { Image } from "../ui/image";
import { TouchableOpacity } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from "react-i18next";
import { ListItemCardProps } from "./types/list-item-card";

const money = (n: number) => `$${Math.round(n).toLocaleString('es-AR')}`;
const PLACEHOLDER_IMG = 'https://picsum.photos/200/300';

export const ListItemCard = ({ item, canEdit, unitPrice, onEdit, onRemove }: ListItemCardProps) => {
  const { t } = useTranslation();
  const hasPrice = unitPrice != null;

  return (
    <HStack className="bg-background-0 rounded-2xl w-full p-3 items-center" space="md">
      <Image
        source={{ uri: item.product.imageUrl || PLACEHOLDER_IMG }}
        className="w-16 h-16 rounded-xl"
        alt={item.product.name}
      />

      <VStack className="flex-1" space="xs">
        <Heading className="text-[14px] font-bold uppercase" numberOfLines={2}>
          {item.product.name}
        </Heading>
        <HStack space="xs" className="items-center flex-wrap">
          <Text className="text-sm text-typography-600 capitalize">
            {`${item.product.presentationQty} ${item.product.presentationUnit}`}
          </Text>
          {hasPrice && (
            <Text className="text-sm text-typography-500" style={{ fontVariant: ['tabular-nums'] }}>
              {`· ${money(unitPrice!)} ${t('screen.lists.perUnit')}`}
            </Text>
          )}
          <Text className="text-sm text-typography-500" style={{ fontVariant: ['tabular-nums'] }}>
            {`· x${item.quantity}`}
          </Text>
        </HStack>
        {item.notes ? (
          <Text className="text-xs text-typography-500" numberOfLines={1}>
            {item.notes}
          </Text>
        ) : null}
      </VStack>

      <VStack className="items-end" space="sm">
        {hasPrice ? (
          <Heading className="text-lg font-extrabold" style={{ fontVariant: ['tabular-nums'] }}>
            {money(unitPrice! * item.quantity)}
          </Heading>
        ) : (
          <Text className="text-xs text-typography-500">{t('screen.lists.noPrice')}</Text>
        )}
        {canEdit && (
          <HStack space="md">
            <TouchableOpacity onPress={onEdit} hitSlop={8}>
              <Ionicons name="create-outline" size={20} color="#6b7280" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onRemove} hitSlop={8}>
              <Ionicons name="trash-outline" size={20} color="#E63535" />
            </TouchableOpacity>
          </HStack>
        )}
      </VStack>
    </HStack>
  );
};
