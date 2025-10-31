import React, { useEffect } from 'react';
import Gradient from '@/assets/icons/Gradient';
import Logo from '@/assets/icons/Logo';
import { Box } from '@/components/ui/box';
import { ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';

import { Button, ButtonText } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import { Icon } from '@/components/ui/icon';
import { Center } from '@/components/ui/center';
import { StatusBar } from 'expo-status-bar';
import { Spinner } from '@/components/ui/spinner';
import { Image } from '@/components/ui/image';
import { useColorScheme } from '@/components/useColorScheme';
import * as SecureStore from 'expo-secure-store';

export default function Home() {
  const router = useRouter();
  const colorScheme = useColorScheme()

    const isActiveSession = async() => {
    try {
      let firstStart = null
      let sessionToken = null

      firstStart = await SecureStore.getItemAsync('firstStart')
      sessionToken = await SecureStore.getItemAsync('sessionToken')

      console.log('firstStart: ', firstStart);
      console.log('sessionToken: ', sessionToken);
      

      if(firstStart){
        firstStart = await SecureStore.getItemAsync('firstStart')
        console.log('firstStart: ', firstStart);
        if(sessionToken){
          //reloadSession()
        }else{
          router.replace('/signin');
        }
      }else{
        await SecureStore.setItemAsync('firstStart', '1');
        router.replace('/home');
      } 
    } catch (error) {
      
    }
  }

  useEffect(() => {
    isActiveSession()
  }, [])

  return (
    <Box className="flex-1 h-[100vh] bg-background-0 p-10">
      <Center className="flex-1 h-[100vh]">
        <StatusBar style="auto" />
          {colorScheme === 'dark' ? (
            <Image
              size="xl"
              source={require('../assets/icons/LogoDark.png')}
              alt="image"
            />
          ) : (
            <Image
              size="xl"
              source={require('../assets/icons/Logo.png')}
              alt="image"
            />
          )}
          
        <Spinner size="large" color="#e44b5e" className='mt-4' />
      </Center>
    </Box>
  );
}
