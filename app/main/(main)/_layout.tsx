import React, { useEffect, useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
import { Text } from '@/components/ui/text';
import { TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Center } from '@/components/ui/center';
import { usePathname } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { StatusBar } from 'expo-status-bar'
import Ionicons from '@expo/vector-icons/Ionicons';;
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


export default function TabLayout() {
  const pathname = usePathname();
  const { colorScheme } = useColorScheme();

  return (
    <Tabs className='bg-background-0 relative flex-1'>
      <StatusBar style="auto" />
      <TabSlot />
      <SafeAreaView className='w-full'>
        <HStack className='w-full justify-around items-center py-4 bg-gre'>
          <TabTrigger name="home">
            <VStack className='items-center'>
              <MaterialCommunityIcons 
                size={30} 
                name='home-outline' 
                color={colorScheme === 'dark' ? 'white' : 'black'} 
              />
              {pathname === '/main' && <Ionicons size={8} name='ellipse' color="#22c55e" />}
            </VStack>
          </TabTrigger>
          <TouchableOpacity 
            className='p-2 rounded-full bg-primary-500/20'
            onPress={() => {}}
          >
            <Center className='w-14 h-14 bg-primary-500 rounded-full'>
              <MaterialCommunityIcons name="barcode-scan" size={24} color="white" />
            </Center>
          </TouchableOpacity>
          <TabTrigger name="lists">
            <VStack className='items-center'>
              <MaterialCommunityIcons 
                size={30} 
                name='clipboard-text-outline' 
                color={colorScheme === 'dark' ? 'white' : 'black'} 
              />
              {pathname === '/main/lists' && <Ionicons size={8} name='ellipse' color="#22c55e" />}
            </VStack>
          </TabTrigger>
        </HStack>
      </SafeAreaView>
      <TabList style={{ display: 'none' }}>
        <TabTrigger 
          name="home" 
          href="/"
          
        >
          <Text>Home</Text>
        </TabTrigger>
        <TabTrigger name="lists" href="/main/lists">
          <Text>settings</Text>
        </TabTrigger>
      </TabList>
    </Tabs>
  )
}
