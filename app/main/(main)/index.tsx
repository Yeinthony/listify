import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '@/components/generals/CustomHeader';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { SearchText } from '@/components/inputs/SearchText';
import { Pressable, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Home() {
  const { t } = useTranslation()

  return (
    <VStack className='flex-1 bg-background-100'>
      <VStack className='w-full pb-2 bg-primary-500 rounded-b-[15%] relative'>
        <SafeAreaView>
          <CustomHeader 
            title={t('screen.home.title')} 
            white
          />
        </SafeAreaView>
        <HStack 
          className='absolute -bottom-8 self-center items-center justify-between z-10 mx-6'
        >
          <SearchText 
            className='flex-1'
            value=''
            onTextChange={() => {}}
          />
          <Pressable 
            onPress={() => {}}
            className='bg-background-0 h-14 w-14 rounded-xl items-center justify-center ml-4'
          >
            <Ionicons 
              name="options-outline" 
              size={26} 
              color="black"
            />
          </Pressable>
        </HStack>
      </VStack>

      <VStack className='flex-1'>
        <Center className="flex-1">
          <Heading className="font-bold text-2xl">Home</Heading>
        </Center>
      </VStack>
    </VStack>
  );
}
