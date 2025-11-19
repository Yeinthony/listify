import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStore } from '@/store/userStore';
import { useTranslation } from 'react-i18next';
import ChangePassForm from '@/components/forms/ChangePassForm';
import CustomHeader from '@/components/generals/CustomHeader';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function PersonalData() {
  const { user } = useUserStore()
  const { t } = useTranslation()
  const colorScheme = useColorScheme()

  return (
    <VStack className="flex-1 bg-background-100">
      <VStack className='w-full bg-primary-500 rounded-b-[15%] relative'>
        <SafeAreaView className='pb-14'>
          <CustomHeader 
            title={t('screen.personalData.title')} 
            white
          />
        </SafeAreaView>
        <HStack 
          className='items-center justify-center absolute -bottom-10 w-full' 
          space='md'
        >
          <Avatar 
            size='2xl'
            className='relative'
          >
            <AvatarFallbackText>
              {user?.username ? user.username : '-------'}
            </AvatarFallbackText>
            <AvatarImage
              source={{
                uri: 'https://xsgames.co/randomusers/avatar.php?g=male',
              }}
            />
            <TouchableOpacity 
              onPress={() => {}}
              className='bg-primary-500 p-2 rounded-xl absolute -bottom-1 right-1'
            >
              <Ionicons 
                name="pencil" 
                size={16} 
                color="white"
              />
            </TouchableOpacity>
          </Avatar>
        </HStack>
      </VStack>
      <SafeAreaView className='flex-1'>
        {user && (
          <VStack className='flex-1 mx-6 mt-2'>
            <VStack className='justify-center items-center'>
              <Heading className='text-3xl'>
                {user.username ? user.username : '-------'}
              </Heading>
              <Text className='text-lg'>
                {user.email}
              </Text>
            </VStack>
            <VStack>
              <VStack className='bg-background-0 rounded-2xl  mt-6 px-4 py-3'>
                <Heading className='font-medium'>
                  General
                </Heading>
              </VStack>
              <VStack className='bg-background-0 rounded-2xl  mt-6 px-4 py-3'>
                <VStack className='mb-4'>
                  <Heading className='font-medium'>
                    Cambiar Contraseña
                  </Heading>
                </VStack>
                <ChangePassForm 
                  email={user.email}
                  noTitle
                />
              </VStack>
            </VStack>
          </VStack>
        )}
      </SafeAreaView>
    </VStack>
  );
}
