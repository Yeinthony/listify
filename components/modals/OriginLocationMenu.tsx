import { Menu, MenuItem, MenuItemLabel } from "@/components/ui/menu";
import { Text } from "@/components/ui/text";
import { TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { HStack } from "../ui/hstack";
import { OriginLocationMenuProps } from "./types/origin-location";
import Ionicons from "@expo/vector-icons/Ionicons";

export const OriginLocationMenu = ({
  locations,
  selectedId,
  originName,
  onSelect,
  onSelectMyLocation,
  onAddLocation,
  placement = "bottom",
  className
}: OriginLocationMenuProps) => {
  const { t } = useTranslation();

  return (
    <Menu
      placement={placement}
      className={className}
      offset={5}
      closeOnSelect={true}
      trigger={({ ...triggerProps }) => {
        return (
          <TouchableOpacity {...triggerProps}>
            <HStack
              space='xs'
              className='items-center bg-primary-500/20 px-2 py-0.5 rounded-full border-[1px] border-primary-500'
            >
              <Text
                className='text-sm text-primary-500 max-w-[140px]'
                numberOfLines={1}
                ellipsizeMode='tail'
              >
                {originName}
              </Text>
              <Ionicons
                name="chevron-down-outline"
                size={14}
                color="#e44b5e"
              />
            </HStack>
          </TouchableOpacity>
        );
      }}
    >
      <MenuItem
        key="my-location"
        textValue="my-location"
        className={`justify-center ${!selectedId && 'bg-primary-500/20'}`}
        onPress={onSelectMyLocation}
      >
        <MenuItemLabel
          className={`${!selectedId && 'text-primary-500'}`}
          size="sm"
        >
          {t('screen.origin-location.myLocation')}
        </MenuItemLabel>
      </MenuItem>
      {locations.map(location => (
        <MenuItem
          key={location.id}
          textValue={location.id}
          className={`justify-center mt-1 ${selectedId === location.id && 'bg-primary-500/20'}`}
          onPress={() => onSelect(location.id)}
        >
          <MenuItemLabel
            className={`text-center ${selectedId === location.id && 'text-primary-500'}`}
            size="sm"
            numberOfLines={1}
          >
            {location.name}
          </MenuItemLabel>
        </MenuItem>
      ))}
      <MenuItem
        key="add-location"
        textValue="add-location"
        className={`justify-center bg-primary-500 py-1.5 mt-1`}
        onPress={onAddLocation}
      >
        <MenuItemLabel
          className={`text-white`}
          size="sm"
        >
          {t('screen.origin-location.add')}
        </MenuItemLabel>
      </MenuItem>
    </Menu>
  );
};
