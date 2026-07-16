import { HStack } from '../ui/hstack';
import { VStack } from '../ui/vstack';
import { View } from 'react-native';
import { Motion } from '@legendapp/motion';
import { useEffect, useState } from 'react';

const MotionView = Motion.View as any;

export const CollaboratorCardSkeleton = () => {
  const [bright, setBright] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setBright((b) => !b), 650);
    return () => clearInterval(id);
  }, []);

  return (
    <MotionView
      className='bg-background-0 rounded-2xl w-full p-4'
      style={{ borderCurve: 'continuous' }}
      animate={{ opacity: bright ? 1 : 0.5 }}
      transition={{ type: 'timing', duration: 650 }}
    >
      <HStack space='md' className='items-center'>
        <View className='w-12 h-12 rounded-full bg-background-200' />
        <VStack className='flex-1' space='sm'>
          <View className='h-4 w-1/2 rounded-md bg-background-200' />
          <View className='h-3 w-3/4 rounded-md bg-background-200' />
        </VStack>
        <View className='h-6 w-16 rounded-full bg-background-200' />
      </HStack>
    </MotionView>
  );
};
