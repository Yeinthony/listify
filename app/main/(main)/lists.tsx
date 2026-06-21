import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '@/components/generals/CustomHeader';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';

export default function Lists() {
  const { t } = useTranslation()

  return (
    <VStack className='flex-1 bg-background-100'>
      <VStack className='w-full pb-4 bg-primary-500 rounded-b-[15%] relative'>
        <SafeAreaView>
          <CustomHeader 
            title={t('screen.lists.title')} 
            white
          />
        </SafeAreaView>
      </VStack>

      <VStack className='flex-1'>
        <Center className="flex-1">
          <Heading className="font-bold text-2xl">Lists</Heading>
        </Center>
      </VStack>
    </VStack>
  );
}
