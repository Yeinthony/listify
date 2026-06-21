import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '@/components/generals/CustomHeader';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Center } from '@/components/ui/center';
import { Spinner } from '@/components/ui/spinner';
import { Badge, BadgeText } from '@/components/ui/badge';
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
} from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import { FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { Controller } from 'react-hook-form';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useListCollaborators } from '@/hooks/screens/useListCollaborators';
import { useListDetail } from '@/hooks/screens/useListDetail';
import { useInviteCollaboratorForm } from '@/components/forms/hooks/useInviteCollaboratorForm';

export default function ListCollaborators() {
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id || '';

  const { collaborators, loading, refreshing, refetch, invite, changeRole, remove, leave } = useListCollaborators(id);
  const { list } = useListDetail(id);
  const { control, errors, onSubmit } = useInviteCollaboratorForm({ onInvite: invite });

  const isOwner = list?.myRole === 'owner';

  return (
    <VStack className='flex-1 bg-background-100'>
      <VStack className='w-full pb-4 bg-primary-500 rounded-b-[15%]'>
        <SafeAreaView>
          <CustomHeader title={t('screen.lists.collaborators')} white />
        </SafeAreaView>
      </VStack>

      {isOwner && (
        <VStack className='px-4 py-3' space='sm'>
          <FormControl isInvalid={!!errors.email}>
            <Input className='rounded-2xl h-14 bg-background-0' size='lg'>
              <Controller
                name='email'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <InputField
                    placeholder={t('input.placeholder.email')}
                    value={value}
                    onChangeText={onChange}
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

          <Controller
            name='role'
            control={control}
            render={({ field: { onChange, value } }) => (
              <HStack space='sm'>
                {(['reader', 'editor'] as const).map((r) => (
                  <TouchableOpacity
                    key={r}
                    onPress={() => onChange(r)}
                    className={`px-4 py-2 rounded-full ${value === r ? 'bg-primary-500' : 'bg-background-0'}`}
                  >
                    <Text className={value === r ? 'text-white' : ''}>{t(`role.${r}`)}</Text>
                  </TouchableOpacity>
                ))}
              </HStack>
            )}
          />

          <TouchableOpacity onPress={onSubmit}>
            <Center className='bg-primary-500 rounded-2xl h-12'>
              <Text className='text-white font-medium'>{t('screen.lists.invite')}</Text>
            </Center>
          </TouchableOpacity>
        </VStack>
      )}

      <VStack className='flex-1'>
        {loading ? (
          <Center className='flex-1'>
            <Spinner />
          </Center>
        ) : (
          <FlatList
            data={collaborators}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16, gap: 12, flexGrow: 1 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refetch} />}
            renderItem={({ item }) => (
              <HStack className='bg-background-0 rounded-2xl p-4 items-center' space='md'>
                <VStack className='flex-1'>
                  <Heading className='text-[14px] font-bold'>{item.user.username}</Heading>
                  <Text className='text-sm text-typography-600'>{item.user.email}</Text>
                </VStack>
                <Badge size='sm' className='rounded-full'>
                  <BadgeText className='capitalize'>{t(`role.${item.role}`)}</BadgeText>
                </Badge>
                {isOwner && item.role !== 'owner' && (
                  <HStack space='sm'>
                    <TouchableOpacity
                      onPress={() => changeRole({ collabId: item.id, data: { role: item.role === 'reader' ? 'editor' : 'reader' } })}
                      className='p-1'
                    >
                      <Ionicons name='swap-horizontal' size={20} color='#6b7280' />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => remove(item.id)} className='p-1'>
                      <Ionicons name='trash-outline' size={20} color='#E63535' />
                    </TouchableOpacity>
                  </HStack>
                )}
              </HStack>
            )}
          />
        )}
      </VStack>

      {!isOwner && (
        <VStack className='px-4 pb-6'>
          <TouchableOpacity
            onPress={async () => {
              await leave();
              router.back();
            }}
          >
            <Center className='border-[1.5px] border-error-500 rounded-2xl h-12'>
              <Text className='text-error-500 font-medium'>{t('screen.lists.leave')}</Text>
            </Center>
          </TouchableOpacity>
        </VStack>
      )}
    </VStack>
  );
}
