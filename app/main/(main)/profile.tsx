import EditScreenInfo from '@/components/EditScreenInfo';
import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useUserStore } from '@/store/userStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HStack } from '@/components/ui/hstack';
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  AvatarBadge,
} from '@/components/ui/avatar';
import { TouchableOpacity, useColorScheme } from 'react-native';
import { ThemeModal } from '@/components/modals/ThemeModal';
import { LangModal } from '@/components/modals/LangModal';
import { LogoutModal } from '@/components/modals/LogutModal';
import { useProfile } from '@/hooks/screens/useProfile';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import CustomHeader from '@/components/generals/CustomHeader';
import Ionicons from '@expo/vector-icons/Ionicons';



export default function Profile() {
  const { user } = useUserStore()
  const { t } = useTranslation()
  const { 
    showThemeModal,
    showLangModal,
    showLogoutModal,
    setShowThemeModal,
    setShowLangModal,
    setShowLogoutModal
  } = useProfile()
  const colorScheme = useColorScheme()

  return (
    <VStack className="flex-1 bg-background-100">
      <VStack className='w-full bg-primary-500 rounded-b-[15%] relative'>
        <SafeAreaView>
          <CustomHeader 
            title={t('screen.profile.title')} 
            white
          />
        </SafeAreaView>
        <HStack 
          className='mx-6 pb-16 items-center justify-between -mt-4'
        >
          <HStack 
            className='items-center flex-shrink' 
            space='md'
          >
            <Avatar 
              size='lg'
            >
              <AvatarFallbackText>
                {user?.username ? user.username : '-------'}
              </AvatarFallbackText>
              <AvatarImage
                source={{
                  uri: 'https://xsgames.co/randomusers/avatar.php?g=male',
                }}
              />
            </Avatar>
            <VStack className='flex-1 mr-4'>
              <Heading className='text-white text-xl'>
                {user?.username ? user.username : '-------'}
              </Heading>
              <Text className='text-white text-sm'>
                {user?.email}
              </Text>
            </VStack>
          </HStack>
          <TouchableOpacity 
            onPress={() => router.push('/main/personal-data')}
            className='bg-background-0 p-2 rounded-xl'
          >
            <Ionicons 
              name="pencil" 
              size={20} 
              color={colorScheme === 'dark' ? 'white' : 'black'}
            />
          </TouchableOpacity>
        </HStack>
        <HStack 
          className='w-[85%] bg-background-0 p-3 rounded-2xl absolute bottom-[-18px] self-center items-center justify-between'
        >
          <HStack className='items-center' space='sm'>
            <Ionicons 
              name="trophy" 
              size={30} 
              color="#e44b5e" 
            />
            <Heading 
              className='font-normal text-xl'
            >
              {t('screen.profile.bannerPlan.noPlan')}
            </Heading>
            </HStack>
          <Ionicons name="chevron-forward-outline" size={25} color="black" />
        </HStack>
      </VStack>
      <SafeAreaView className='flex-1'>
        <VStack className='bg-background-0 rounded-2xl mx-4 mt-6 mb-32'>
          <TouchableOpacity 
            className='px-4 py-3'
            onPress={() => setShowLangModal(true)}
          >
            <HStack className='items-center justify-between'>
              <HStack 
                className='items-center' 
                space='md'
              >
                <Ionicons 
                  name="language-outline" 
                  size={22} 
                  color={colorScheme === 'dark' ? 'white' : 'black'}
                />
                <Text className='text-lg'>
                  {t('screen.profile.setting.language')}
                </Text>
              </HStack>
              <Ionicons 
                name="chevron-forward-outline" 
                size={20} 
                color={colorScheme === 'dark' ? 'white' : 'black'}
              />
            </HStack>
          </TouchableOpacity>
          <Divider className="w-[95%] self-center" />
          <TouchableOpacity 
            onPress={() => setShowThemeModal(true)}
            className='px-4 py-3'
          >
            <HStack className='items-center justify-between'>
              <HStack className='items-center' space='md'>
                <Ionicons 
                  name="contrast-outline" 
                  size={22} 
                  color={colorScheme === 'dark' ? 'white' : 'black'}
                />
                <Text className='text-lg'>
                  {t('screen.profile.setting.theme')}
                </Text>
              </HStack>
              <Ionicons 
                name="chevron-forward-outline" 
                size={20} 
                color={colorScheme === 'dark' ? 'white' : 'black'}
              />
            </HStack>
          </TouchableOpacity>
          <Divider className="w-[95%] self-center" />
          <TouchableOpacity className='px-4 py-3'>
            <HStack className='items-center justify-between'>
              <HStack className='items-center' space='md'>
                <Ionicons 
                  name="notifications-outline" 
                  size={22} 
                  color={colorScheme === 'dark' ? 'white' : 'black'}
                />
                <Text className='text-lg'>
                  {t('screen.profile.setting.notifications')}
                </Text>
              </HStack>
              <Ionicons 
                name="chevron-forward-outline" 
                size={20} 
                color={colorScheme === 'dark' ? 'white' : 'black'}
              />
            </HStack>
          </TouchableOpacity>
          <Divider className="w-[95%] self-center" />
          <TouchableOpacity className='px-4 py-3'>
            <HStack className='items-center justify-between'>
              <HStack className='items-center' space='md'>
                <Ionicons 
                  name="heart-outline" 
                  size={22} 
                  color={colorScheme === 'dark' ? 'white' : 'black'}
                />
                <Text className='text-lg'>
                  {t('screen.profile.setting.favorites')}
                </Text>
              </HStack>
              <Ionicons 
                name="chevron-forward-outline" 
                size={20} 
                color={colorScheme === 'dark' ? 'white' : 'black'}
              />
            </HStack>
          </TouchableOpacity>
          <Divider className="w-[95%] self-center" />
          <TouchableOpacity 
            className='px-4 py-3'
            onPress={() => router.push('/main/manage-locations')}
          >
            <HStack className='items-center justify-between'>
              <HStack className='items-center' space='md'>
                <Ionicons 
                  name="location-outline" 
                  size={22} 
                  color={colorScheme === 'dark' ? 'white' : 'black'}
                />
                <Text className='text-lg'>
                  {t('screen.profile.setting.locations')}
                </Text>
              </HStack>
              <Ionicons 
                name="chevron-forward-outline" 
                size={20} 
                color={colorScheme === 'dark' ? 'white' : 'black'}
              />
            </HStack>
          </TouchableOpacity>
          <Divider className="w-[95%] self-center" />
          <TouchableOpacity className='px-4 py-3'>
            <HStack className='items-center justify-between'>
              <HStack className='items-center' space='md'>
                <Ionicons 
                  name="help-circle-outline" 
                  size={22} 
                  color={colorScheme === 'dark' ? 'white' : 'black'} 
                />
                <Text className='text-lg'>
                  FAQS
                </Text>
              </HStack>
              <Ionicons 
                name="chevron-forward-outline" 
                size={20} 
                color={colorScheme === 'dark' ? 'white' : 'black'}
              />
            </HStack>
          </TouchableOpacity>
          <Divider className="w-[95%] self-center" />
          <TouchableOpacity 
            onPress={() => setShowLogoutModal(true)}
            className='px-4 py-3'
          >
            <HStack className='items-center justify-between'>
              <HStack className='items-center' space='md'>
                <Ionicons 
                  name="log-out-outline" 
                  size={22} 
                  color="#E63535" 
                />
                <Text className='text-lg text-error-500'>
                  {t('screen.profile.logout')}
                </Text>
              </HStack>
              <Ionicons 
                name="chevron-forward-outline" 
                size={20} 
                color="#E63535" 
              />
            </HStack>
          </TouchableOpacity>
        </VStack>
      </SafeAreaView>
      
      {/* Modals */}
      <LangModal 
        isOpen={showLangModal}
        onClose={() => setShowLangModal(false)}
      />
      <ThemeModal 
        isOpen={showThemeModal}
        onClose={() => setShowThemeModal(false)}
      />

      <LogoutModal 
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      />
    </VStack>
  );
}
