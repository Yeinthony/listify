import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Center } from '@/components/ui/center';
import { Spinner } from '@/components/ui/spinner';
import { Avatar, AvatarFallbackText } from '@/components/ui/avatar';
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
} from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import { TouchableOpacity } from 'react-native';
import { Controller, useWatch } from 'react-hook-form';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInviteCollaboratorForm } from '@/components/forms/hooks/useInviteCollaboratorForm';
import { useSearchUsers } from '@/hooks/screens/useSearchUsers';
import { AddCollaboratorPayload } from '@/api/types/shopping-lists';
import { PublicUser } from '@/types/users';

const initials = (value: string) =>
  value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join('') || '?';

interface InviteCollaboratorProps {
  onInvite: (payload: AddCollaboratorPayload) => Promise<unknown>;
  inviting?: boolean;
  excludeUserIds?: string[];
}

export const InviteCollaborator = ({
  onInvite,
  inviting = false,
  excludeUserIds = [],
}: InviteCollaboratorProps) => {
  const { t } = useTranslation();
  const { control, errors, onSubmit, setValue } = useInviteCollaboratorForm({ onInvite });
  const email = useWatch({ control, name: 'email' }) ?? '';
  const [suppressed, setSuppressed] = useState(false);

  const { results, isLoading, enabled } = useSearchUsers(email, !suppressed);
  const suggestions = results.filter((u) => !excludeUserIds.includes(u.id));

  const showDropdown = enabled && !suppressed;

  const onSelect = (u: PublicUser) => {
    setValue('email', u.email, { shouldValidate: true });
    setSuppressed(true);
  };

  return (
    <VStack className='bg-background-0 rounded-2xl p-4' style={{ borderCurve: 'continuous' }} space='sm'>
      <FormControl isInvalid={!!errors.email}>
        <Input className='rounded-2xl h-14 bg-background-100' size='lg'>
          <Controller
            name='email'
            control={control}
            render={({ field: { onChange, value } }) => (
              <InputField
                placeholder={t('screen.lists.inviteSearchPlaceholder')}
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                  setSuppressed(false);
                }}
                autoCapitalize='none'
                keyboardType='email-address'
              />
            )}
          />
        </Input>
        <FormControlError>
          <FormControlErrorText>{errors.email?.message}</FormControlErrorText>
        </FormControlError>
      </FormControl>

      {showDropdown && (
        <VStack className='bg-background-100 rounded-2xl overflow-hidden'>
          {isLoading ? (
            <Center className='py-4'>
              <Spinner color='#e44b5e' />
            </Center>
          ) : suggestions.length > 0 ? (
            suggestions.map((u) => {
              const primary = u.username || u.email;
              return (
                <TouchableOpacity key={u.id} onPress={() => onSelect(u)}>
                  <HStack space='md' className='items-center px-3 py-2.5'>
                    <Avatar size='sm' className='bg-primary-600'>
                      <AvatarFallbackText>{initials(primary)}</AvatarFallbackText>
                    </Avatar>
                    <VStack className='flex-1'>
                      <Text className='text-sm font-medium' numberOfLines={1}>{primary}</Text>
                      {u.username && (
                        <Text className='text-xs text-typography-500' numberOfLines={1}>{u.email}</Text>
                      )}
                    </VStack>
                  </HStack>
                </TouchableOpacity>
              );
            })
          ) : (
            <Center className='py-4 px-3'>
              <Text className='text-sm text-typography-500'>{t('screen.lists.inviteNoResults')}</Text>
            </Center>
          )}
        </VStack>
      )}

      <Controller
        name='role'
        control={control}
        render={({ field: { onChange, value } }) => (
          <HStack space='sm'>
            {(['reader', 'editor'] as const).map((r) => (
              <TouchableOpacity
                key={r}
                onPress={() => onChange(r)}
                className={`px-4 py-2 rounded-full ${value === r ? 'bg-primary-500' : 'bg-background-100'}`}
              >
                <Text className={value === r ? 'text-white' : ''}>{t(`role.${r}`)}</Text>
              </TouchableOpacity>
            ))}
          </HStack>
        )}
      />

      <TouchableOpacity onPress={onSubmit} disabled={inviting}>
        <Center className={`bg-primary-500 rounded-2xl h-12 ${inviting ? 'opacity-60' : ''}`}>
          {inviting ? (
            <Spinner color='white' />
          ) : (
            <Text className='text-white font-medium'>{t('screen.lists.invite')}</Text>
          )}
        </Center>
      </TouchableOpacity>
    </VStack>
  );
};
