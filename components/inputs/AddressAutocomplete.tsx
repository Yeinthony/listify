import { useEffect, useRef, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Spinner } from '@/components/ui/spinner';
import { Divider } from '@/components/ui/divider';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SearchText } from '@/components/inputs/SearchText';
import { autocompleteAddress } from '@/api/geocoding.api';
import { AddressSuggestion } from '@/api/types/geocoding';

interface AddressAutocompleteProps {
  onSelect: (suggestion: AddressSuggestion) => void;
  initialValue?: string;
  placeholder?: string;
}

const MIN_CHARS = 3;
const DEBOUNCE_MS = 350;

export const AddressAutocomplete = ({ onSelect, initialValue, placeholder }: AddressAutocompleteProps) => {
  const { t } = useTranslation();
  const [input, setInput] = useState(initialValue ?? '');
  const [debounced, setDebounced] = useState(input.trim());
  const [open, setOpen] = useState(false);
  const skipNextSearch = useRef(false);

  useEffect(() => {
    if (skipNextSearch.current) {
      skipNextSearch.current = false;
      return;
    }
    const timer = setTimeout(() => setDebounced(input.trim()), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [input]);

  const enabled = open && debounced.length >= MIN_CHARS;

  const { data: suggestions = [], isFetching } = useQuery({
    queryKey: ['geocode-autocomplete', debounced],
    queryFn: ({ signal }) => autocompleteAddress(debounced, signal),
    enabled,
    staleTime: 1000 * 60 * 60,
  });

  const handleSelect = (suggestion: AddressSuggestion) => {
    skipNextSearch.current = true;
    setInput(suggestion.title);
    setOpen(false);
    onSelect(suggestion);
  };

  const showPanel = enabled;

  return (
    <VStack className="w-full">
      <SearchText
        value={input}
        onTextChange={(text) => {
          setInput(text);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder ?? t('screen.add-location.searchPlaceholder')}
        icon={<Ionicons name="location-outline" size={20} color="#e44b5e" />}
      />

      {showPanel && (
        <VStack className="bg-background-0 rounded-2xl mt-1 overflow-hidden shadow-md">
          {isFetching && (
            <HStack className="items-center px-4 py-3" space="sm">
              <Spinner size="small" color="#e44b5e" />
              <Text className="text-sm text-typography-500">{t('screen.add-location.searching')}</Text>
            </HStack>
          )}

          {!isFetching && suggestions.length === 0 && (
            <Text className="text-sm text-typography-500 px-4 py-3">
              {t('screen.add-location.noResults')}
            </Text>
          )}

          {!isFetching &&
            suggestions.map((s, index) => (
              <VStack key={s.placeId}>
                {index > 0 && <Divider className="bg-background-100" />}
                <TouchableOpacity onPress={() => handleSelect(s)}>
                  <HStack className="items-center px-4 py-3" space="sm">
                    <Ionicons name="location-outline" size={18} color="#9ca3af" />
                    <VStack className="flex-1">
                      <Text className="text-sm font-medium" numberOfLines={1}>{s.title}</Text>
                      {!!s.subtitle && (
                        <Text className="text-xs text-typography-500" numberOfLines={1}>{s.subtitle}</Text>
                      )}
                    </VStack>
                  </HStack>
                </TouchableOpacity>
              </VStack>
            ))}

          {!isFetching && suggestions.length > 0 && (
            <Text className="text-[10px] text-typography-400 px-4 py-1.5 text-right">
              {t('screen.add-location.attribution')}
            </Text>
          )}
        </VStack>
      )}
    </VStack>
  );
};
