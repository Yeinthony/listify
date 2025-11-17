import EditScreenInfo from '@/components/EditScreenInfo';
import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useUserStore } from '@/store/userStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { HStack } from '@/components/ui/hstack';
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  AvatarBadge,
} from '@/components/ui/avatar';
import { TouchableOpacity } from 'react-native';
import CustomHeader from '@/components/generals/CustomHeader';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';



export default function Profile() {
  const { user } = useUserStore()

  return (
    <VStack className="flex-1">
      <StatusBar style='light' />
      <VStack className='bg-primary-500 rounded-b-[20%] relative'>
        <SafeAreaView>
          <CustomHeader title='Perfil' />
        </SafeAreaView>
        <HStack 
          className='mx-6 pb-16 items-center justify-between -mt-4'
          space='md'
        >
          <HStack 
            className='items-center' 
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
                  uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
                }}
              />
            </Avatar>
            <VStack>
              <Heading className='text-white text-xl'>
                {user?.username ? user.username : '-------'}
              </Heading>
              <Text className='text-white text-sm'>
                {user?.email}
              </Text>
            </VStack>
          </HStack>
          <TouchableOpacity className='bg-background-0 p-2 rounded-xl'>
            <Ionicons 
              name="pencil" 
              size={20} 
              color="black" 
            />
          </TouchableOpacity>
        </HStack>
        <HStack 
          className='w-[85%] bg-background-0 p-3 rounded-2xl absolute bottom-[-18px] self-center items-center justify-between'
        >
          <HStack className='items-center' space='sm'>
            {/* <MaterialCommunityIcons 
              name="shield-crown-outline" 
              size={30} 
              color="#e44b5e" 
            /> */}
            <Ionicons 
              name="trophy" 
              size={30} 
              color="#e44b5e" 
            />
            <Heading 
              className='font-normal text-xl'
            >
              Obtener premium
            </Heading>
            </HStack>
          <Ionicons name="chevron-forward-outline" size={25} color="black" />
        </HStack>
      </VStack>
      <SafeAreaView className='flex-1'>
        <VStack className='bg-background-0 rounded-2xl mx-4 mt-6 mb-32'>
          <TouchableOpacity className='px-4 py-3'>
            <HStack className='items-center justify-between'>
              <HStack className='items-center' space='md'>
                <Ionicons 
                  name="language-outline" 
                  size={22} 
                  color="balck" 
                />
                <Text className='text-lg'>
                  Idioma
                </Text>
              </HStack>
              <Ionicons name="chevron-forward-outline" size={20} color="black" />
            </HStack>
          </TouchableOpacity>
          <Divider className="w-[95%] self-center" />
          <TouchableOpacity className='px-4 py-3'>
            <HStack className='items-center justify-between'>
              <HStack className='items-center' space='md'>
                <Ionicons 
                  name="contrast-outline" 
                  size={22} 
                  color="balck" 
                />
                <Text className='text-lg'>
                  Tema
                </Text>
              </HStack>
              <Ionicons name="chevron-forward-outline" size={20} color="black" />
            </HStack>
          </TouchableOpacity>
          <Divider className="w-[95%] self-center" />
          <TouchableOpacity className='px-4 py-3'>
            <HStack className='items-center justify-between'>
              <HStack className='items-center' space='md'>
                <Ionicons 
                  name="heart-outline" 
                  size={22} 
                  color="balck" 
                />
                <Text className='text-lg'>
                  Favoritos
                </Text>
              </HStack>
              <Ionicons name="chevron-forward-outline" size={20} color="black" />
            </HStack>
          </TouchableOpacity>
          <Divider className="w-[95%] self-center" />
          <TouchableOpacity className='px-4 py-3'>
            <HStack className='items-center justify-between'>
              <HStack className='items-center' space='md'>
                <Ionicons 
                  name="location-outline" 
                  size={22} 
                  color="balck" 
                />
                <Text className='text-lg'>
                  Ubicaciones
                </Text>
              </HStack>
              <Ionicons name="chevron-forward-outline" size={20} color="black" />
            </HStack>
          </TouchableOpacity>
          <Divider className="w-[95%] self-center" />
          <TouchableOpacity className='px-4 py-3'>
            <HStack className='items-center justify-between'>
              <HStack className='items-center' space='md'>
                <Ionicons 
                  name="help-circle-outline" 
                  size={22} 
                  color="balck" 
                />
                <Text className='text-lg'>
                  FAQS
                </Text>
              </HStack>
              <Ionicons name="chevron-forward-outline" size={20} color="black" />
            </HStack>
          </TouchableOpacity>
          <Divider className="w-[95%] self-center" />
          <TouchableOpacity className='px-4 py-3'>
            <HStack className='items-center justify-between'>
              <HStack className='items-center' space='md'>
                <Ionicons 
                  name="log-out-outline" 
                  size={22} 
                  color="#E63535" 
                />
                <Text className='text-lg text-error-500'>
                  Cerra sesión
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
    </VStack>
  );
}
