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
    <Tabs>
      <StatusBar style="auto" />

      {/* Contenido de las screens */}
      <TabSlot />

      {/* TAB BAR CUSTOM ABAJO */}
      <View 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }}
        className="bg-background-0 pb-10"
      >
        <HStack className='w-full justify-between items-center px-8'>
          <TabTrigger name="home">
            <VStack className='items-center'>
              <Ionicons 
                size={26} 
                name='home-outline' 
                color={colorScheme === 'dark' ? 'white' : 'black'} 
              />
              <Text className='text-xs mt-2'>Home</Text>
            </VStack>
          </TabTrigger>

          <TabTrigger name="lists">
            <VStack className='items-center'>
              <Ionicons 
                size={26} 
                name='reader-outline' 
                color={colorScheme === 'dark' ? 'white' : 'black'} 
              />
              <Text className='text-xs mt-2'>Listas</Text>
            </VStack>
          </TabTrigger>

          <TouchableOpacity 
            className='rounded-full bottom-10 border-8 border-background-100'
            onPress={() => {}}
          >
            <Center className='w-20 h-20 bg-primary-500 rounded-full'>
              <MaterialCommunityIcons name="barcode-scan" size={28} color="white" />
            </Center>
          </TouchableOpacity>

          <TabTrigger name="recipes">
            <VStack className='items-center'>
              <Ionicons 
                size={26} 
                name='restaurant-outline' 
                color={colorScheme === 'dark' ? 'white' : 'black'} 
              />
              <Text className='text-xs mt-2'>Recetas</Text>
            </VStack>
          </TabTrigger>

          <TabTrigger name="profile">
            <VStack className='items-center'>
              <Ionicons 
                size={26} 
                name='person-outline' 
                color={colorScheme === 'dark' ? 'white' : 'black'} 
              />
              <Text className='text-xs mt-2'>Perfil</Text>
            </VStack>
          </TabTrigger>

        </HStack>
      </View>

      {/* TabList oculto (mantiene navegación interna de tabs) */}
      <TabList style={{ display: 'none' }}>
        <TabTrigger name="home" href="/" />
        <TabTrigger name="lists" href="/main/lists" />
        <TabTrigger name="recipes" href="/main/recipes" />
        <TabTrigger name="profile" href="/main/profile" />
      </TabList>
    </Tabs>
  );
}
