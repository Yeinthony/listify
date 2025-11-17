import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text'; 
import { Divider } from '@/components/ui/divider'
import { VStack } from "@/components/ui/vstack"
import { useColorScheme } from "@/components/useColorScheme";
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Platform, TouchableOpacity } from 'react-native';
import { CustomHeaderProps } from '@/types/components/generals/custom-header';
import { Heading } from '../ui/heading';
import * as SecureStore from 'expo-secure-store';
import Ionicons from '@expo/vector-icons/Ionicons';


const CustomHeader = ({ title, leftButtom = null }: CustomHeaderProps) => {

  const { t } = useTranslation()
  const colorScheme = useColorScheme()
  const router = useRouter()

  return (
    <>
      <VStack 
        className={`
          ${Platform.OS === 'ios' ? 'pt-12' : ''}
        `}
        >
        <HStack className='justify-between items-center px-4 py-3'>
          <HStack 
            className='items-center'
            space='md'
          >
            <TouchableOpacity className='bg-background-0 p-2 rounded-xl'>
              <Ionicons name="chevron-back" size={20} color="black" />
            </TouchableOpacity>
            <Heading className="font-semibold text-lg text-white">{title}</Heading>
          </HStack>
          {leftButtom && leftButtom}
        </HStack>
      </VStack>
    </>
  );
};

export default CustomHeader;