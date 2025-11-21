import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
import { Stack } from "expo-router";
import { Text } from '@/components/ui/text';
import { Motion } from '@legendapp/motion';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Center } from '@/components/ui/center';
import { useColorScheme } from 'nativewind';
import { useSegments } from "expo-router";
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { BarcodeScanModal } from '@/components/modals/BarcodeScanModal';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const MotionView = Motion.View as any;
const MotionPressable = Motion.Pressable as any;

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const { bottom } = useSafeAreaInsets();
  const { t } = useTranslation()

  const segments = useSegments();
  const active = segments[segments.length - 1];

  const [showBarcodeScan, setShowBarcodeScan] = useState<boolean>(false)

  useEffect(() => {
    console.log('active: ', active);
    
  }, [active])
  

  return (
    <Tabs>
      {/* CONTENIDO */}
      <TabSlot />

      {/* BOTÓN FLOANTE */}
      <View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          bottom: bottom + 25,
          left: 0,
          right: 0,
          alignItems: "center",
          zIndex: 50,
        }}
      >
        <Center className='bg-background-100 rounded-full p-2'>
          <MotionPressable onPress={() => setShowBarcodeScan(true)}>
            <MotionView
              whileTap={{ scale: 1.05 }}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 300,
              }}
            >
              <Center className="w-16 h-16 bg-primary-500 rounded-full shadow-xl">
                <MaterialCommunityIcons name="barcode-scan" size={28} color="white" />
              </Center>
            </MotionView>
          </MotionPressable>
        </Center>
        <BarcodeScanModal 
          isOpen={showBarcodeScan}
          onClose={() => setShowBarcodeScan(false)}
        />
      </View>

      {/* TAB BAR */}
      <View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 70 + bottom,      // RESPETA SAFE AREA
          paddingBottom: bottom,    // evita que se tape
          backgroundColor: "transparent",
        }}
      >
        <HStack className="flex-1 bg-background-0 justify-between items-center px-2 border-t-8 border-t-background-100">
          <TabTrigger 
            className='h-full w-[21%] justify-center items-center' 
            name="home"
          >
            <VStack className="items-center justify-center flex-1">
              <Ionicons
                size={26}
                name={active === '(main)' ? 'home' : 'home-outline'}
                color={active === "(main)" ? "#e44b5e" : (colorScheme === "dark" ? "white" : "#6b7280")}
              />
              <Text 
                className="text-xs mt-1"
                style={{
                  color: active === "(main)" ? "#e44b5e" : (colorScheme === "dark" ? "white" : "#6b7280")
                }}
              >
                {t('screen.home.title')}
              </Text>
            </VStack>
          </TabTrigger>

          <TabTrigger 
            className='h-full w-[21%] justify-center items-center' 
            name="lists"
          >
            <VStack className="items-center justify-center flex-1">
              <Ionicons
                size={26}
                name={active === 'lists' ? 'reader' : 'reader-outline'}
                color={active === "lists" ? "#e44b5e" : (colorScheme === "dark" ? "white" : "#6b7280")}
              />
              <Text 
                className="text-xs mt-1"
                style={{
                  color: active === "lists" ? "#e44b5e" : (colorScheme === "dark" ? "white" : "#6b7280")
                }}
              >
                {t('screen.lists.title')}
              </Text>
            </VStack>
          </TabTrigger>

          {/* ESPACIO CENTRAL PARA EL BOTÓN FLOANTE */}
          <View style={{ width: '14%' }} />

          <TabTrigger 
            name="recipes"
            className='h-full w-[21%] justify-center items-center'
          >
            <VStack className="items-center justify-center flex-1">
              <Ionicons
                size={26}
                name={active === 'recipes' ? 'restaurant' : 'restaurant-outline'}
                color={active === "recipes" ? "#e44b5e" : (colorScheme === "dark" ? "white" : "#6b7280")}
              />
              <Text 
                className="text-xs mt-1"
                style={{
                  color: active === "recipes" ? "#e44b5e" : (colorScheme === "dark" ? "white" : "#6b7280")
                }}
              >
                {t('screen.recipes.title')}
              </Text>
            </VStack>
          </TabTrigger>

          <TabTrigger 
            name="profile"
            className='h-full w-[21%] justify-center items-center'
          >
            <VStack className="items-center justify-center flex-1">
              <Ionicons
                size={26}
                name={active === 'profile' ? 'person' : 'person-outline'}
                color={active === "profile" ? "#e44b5e" : (colorScheme === "dark" ? "white" : "#6b7280")}
              />
              <Text 
                className="text-xs mt-1"
                style={{
                  color: active === "profile" ? "#e44b5e" : (colorScheme === "dark" ? "white" : "#6b7280")
                }}
              >
                {t('screen.profile.title')}
              </Text>
            </VStack>
          </TabTrigger>

        </HStack>
      </View>

      {/* TABLIST OCULTO */}
      <TabList style={{ display: "none" }}>
        <TabTrigger name="home" href="/" />
        <TabTrigger name="lists" href="/main/lists" />
        <TabTrigger name="recipes" href="/main/recipes" />
        <TabTrigger name="profile" href="/main/profile" />
      </TabList>
    </Tabs>
  );
}
