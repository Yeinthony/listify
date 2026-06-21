import { HStack } from "../ui/hstack";
import { VStack } from "../ui/vstack";
import { Heading } from "../ui/heading";
import { Text } from "../ui/text";
import { TouchableOpacity } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { ListItemCardProps } from "./types/list-item-card";

export const ListItemCard = ({ item, canEdit, onEdit, onRemove }: ListItemCardProps) => {
  return (
    <HStack className="bg-background-0 rounded-2xl w-full p-4 items-center" space="md">
      <VStack className="flex-1" space="xs">
        <Heading className="text-[14px] font-bold uppercase" numberOfLines={2}>
          {item.product.name}
        </Heading>
        <Text className="text-sm text-typography-600 capitalize">
          {`${item.product.presentationQty} ${item.product.presentationUnit}`}
        </Text>
        {item.notes ? (
          <Text className="text-xs text-typography-500" numberOfLines={2}>
            {item.notes}
          </Text>
        ) : null}
      </VStack>

      <VStack className="items-center" space="xs">
        <Text className="text-lg font-extrabold" style={{ fontVariant: ['tabular-nums'] }}>
          x{item.quantity}
        </Text>
        {canEdit && (
          <HStack space="sm">
            <TouchableOpacity onPress={onEdit} className="p-1">
              <Ionicons name="create-outline" size={20} color="#6b7280" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onRemove} className="p-1">
              <Ionicons name="trash-outline" size={20} color="#E63535" />
            </TouchableOpacity>
          </HStack>
        )}
      </VStack>
    </HStack>
  );
};
