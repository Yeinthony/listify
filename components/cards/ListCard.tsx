import { HStack } from "../ui/hstack";
import { VStack } from "../ui/vstack";
import { Heading } from "../ui/heading";
import { Text } from "../ui/text";
import { Badge, BadgeText } from "../ui/badge";
import { TouchableOpacity } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from "react-i18next";
import { ListCardProps } from "./types/list-card";

const roleAction = {
  owner: 'success',
  editor: 'info',
  reader: 'muted',
} as const;

export const ListCard = ({ list, onPress, onDelete }: ListCardProps) => {
  const { t } = useTranslation();

  return (
    <TouchableOpacity onPress={onPress}>
      <HStack className="bg-background-0 rounded-2xl w-full p-4 items-center" space="md">
        <VStack className="flex-1" space="xs">
          <Heading className="text-[15px] font-bold" numberOfLines={1}>
            {list.name}
          </Heading>
          <HStack space="sm" className="items-center">
            <Text className="text-sm text-typography-600">
              {t('screen.lists.itemCount', { count: list.itemCount })}
            </Text>
            <Badge size="sm" action={roleAction[list.myRole]} className="rounded-full">
              <BadgeText className="capitalize">{t(`role.${list.myRole}`)}</BadgeText>
            </Badge>
          </HStack>
        </VStack>

        {onDelete && list.myRole === 'owner' && (
          <TouchableOpacity onPress={onDelete} className="p-2">
            <Ionicons name="trash-outline" size={20} color="#E63535" />
          </TouchableOpacity>
        )}
        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
      </HStack>
    </TouchableOpacity>
  );
};
