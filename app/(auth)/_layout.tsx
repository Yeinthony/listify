import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { SafeAreaView } from "react-native-safe-area-context"; 
import {
  View,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  Text,
  Platform,
  TouchableWithoutFeedback,
  Button,
  Keyboard,
  ScrollView
} from 'react-native';
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from '@/components/useColorScheme';
import { Image } from "@/components/ui/image";
import { Box } from "@/components/ui/box";

export default function AuthLayout() {
  const colorScheme = useColorScheme()

  return (
    <SafeAreaView className="w-full h-full">
      <StatusBar style="auto" />
      <ScrollView
        className="w-full h-[100vh]"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <VStack className="flex-1 justify-center bg-background-50">
          <VStack
            className="relative w-full items-center  justify-center py-16"
            space="md"
          >
            <Box className="absolute w-[180px] h-[180px] rounded-full bg-tertiary-500/20" />
            {colorScheme === 'dark' ? (
              <Image
                source={require('../../assets/icons/LogoDark.png')}
                size="none"
                className="h-[100px] w-[100px]"
                alt="image"
              />
            ) : (
              <Image
                source={require('../../assets/icons/Logo.png')}
                size="none"
                className="h-[100px] w-[100px]"
                alt="image"
              />
            )}
          </VStack>
          <VStack 
            className="flex-1"
          >
            <Slot />
          </VStack>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
};