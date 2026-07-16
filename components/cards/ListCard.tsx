import { HStack } from "../ui/hstack";
import { VStack } from "../ui/vstack";
import { Center } from "../ui/center";
import { Heading } from "../ui/heading";
import { Text } from "../ui/text";
import { Badge, BadgeText } from "../ui/badge";
import { Pressable, TouchableOpacity } from "react-native";
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

  const isShared = list.myRole !== 'owner';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        borderCurve: 'continuous',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
      className="bg-background-0 rounded-2xl w-full"
    >
      <HStack className="p-4 items-center" space="md">
        <Center className="h-12 w-12 rounded-xl bg-primary-500/10" style={{ borderCurve: 'continuous' }}>
          <Ionicons name="basket-outline" size={22} color="#e44b5e" />
        </Center>

        <VStack className="flex-1" space="xs">
          <Heading className="text-base font-bold" numberOfLines={1}>
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
          {isShared && (
            <HStack space="xs" className="items-center">
              <Ionicons name="person-outline" size={12} color="#9ca3af" />
              <Text className="text-xs text-typography-500" numberOfLines={1}>
                {t('screen.lists.sharedBy', { name: list.owner.username || list.owner.email })}
              </Text>
            </HStack>
          )}
        </VStack>

        {onDelete && list.myRole === 'owner' && (
          <TouchableOpacity onPress={onDelete} className="p-2">
            <Ionicons name="trash-outline" size={20} color="#E63535" />
          </TouchableOpacity>
        )}
        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
      </HStack>
    </Pressable>
  );
};
