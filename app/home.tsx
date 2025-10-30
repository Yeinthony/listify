import React, { useEffect, useState, useRef } from "react";
import { Image } from "@/components/ui/image"
import { VStack } from "@/components/ui/vstack"
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { ScrollView, Dimensions, View, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import { StatusBar } from "expo-status-bar";
import { Pressable } from '@/components/ui/pressable';
import { Link } from "expo-router";
import { HStack } from "@/components/ui/hstack";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "@/components/useColorScheme";
import { 
  useSharedValue, 
  interpolate, 
  Extrapolation, 
} from "react-native-reanimated";
import Carousel, { ICarouselInstance, Pagination } from "react-native-reanimated-carousel";
import { Heading } from "@/components/ui/heading";

const data = [1, 2, 3];

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function Home(){
  const progress = useSharedValue(0);
  const carouselRef = useRef<ICarouselInstance>(null);

  const onPressPagination = (index: number) => {
    carouselRef.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <SafeAreaView className="flex-1">
      <Box className="flex-1 p-6">
        <StatusBar style="auto" />
        <Box className="flex flex-1 items-center my-16 mx-5 lg:my-24 lg:mx-32">
          <Carousel
            data={data}
            height={height - 250}
            pagingEnabled={true}
            snapEnabled={true}
            loop={false}
            width={width}
            onProgressChange={progress}
            renderItem={({ index, item }) => (
              <Center className="flex-1">
                {item === 1 && (
                  <Box 
                    className="flex-1 justify-center items-center h-[20px] w-[300px] lg:h-[160px] lg:w-[400px]">

                    <Center className="h-[250px] w-[250px] rounded-full bg-tertiary-500/20">

                    </Center>
                    
                    <VStack className="mt-20">
                      <Heading className="font-bold text-2xl text-center">
                        Comida variada y brillante.
                      </Heading>
                      <Text className="mt-5 font-light text-center">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat velit laborum veniam animi quas.
                      </Text>
                    </VStack>
                  </Box>
                )} 

                {item === 2 && (
                  <Box 
                    className="flex-1 justify-center items-center h-[20px] w-[300px] lg:h-[160px] lg:w-[400px]">

                    <Center className="h-[250px] w-[250px] rounded-full bg-tertiary-500/20">

                    </Center>
                    
                    <VStack className="mt-20">
                      <Heading className="font-bold text-2xl text-center">
                        Envío gratuito en todos los pedidos.
                      </Heading>
                      <Text className="mt-5 font-light text-center">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat velit laborum veniam animi quas.
                      </Text>
                    </VStack>
                  </Box>
                )} 

                {item === 3 && (
                  <Box 
                    className="flex-1 justify-center items-center h-[20px] w-[300px] lg:h-[160px] lg:w-[400px]">

                    <Center className="h-[250px] w-[250px] rounded-full bg-tertiary-500/20">

                    </Center>
                    
                    <VStack className="mt-20">
                      <Heading className="font-bold text-2xl text-center">
                        +24 mil restaurantes
                      </Heading>
                      <Text className="mt-5 font-light text-center">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat velit laborum veniam animi quas.
                      </Text>
                    </VStack>
                  </Box>
                )} 
              </Center>
            )}
          />

          <Pagination.Custom
            progress={progress}
            data={data}
            size={6}
            dotStyle={{
              borderRadius: 8,
              width: 20,
              height: 7,
              backgroundColor: '#e1e1e1',
            }}
            activeDotStyle={{
              borderRadius: 8,
              width: 40,
              height: 7,
              overflow: "hidden",
              backgroundColor: '#e44b5e',
            }}
            containerStyle={{ gap: 5, marginTop: 15 }}
            horizontal
            onPress={onPressPagination}
            customReanimatedStyle={(progress, index, length) => {
              let val = Math.abs(progress - index);
              if (index === 0 && progress > length - 1) {
                val = Math.abs(progress - length);
              }
  
              return {
                transform: [
                  {
                    translateY: interpolate(
                      val,
                      [0, 1],
                      [0, 0],
                      Extrapolation.CLAMP,
                    ),
                  },
                ],
              };
            }}
          />
        </Box>
        <TouchableOpacity className="bg-primary-500 rounded-2xl h-12 flex justify-center items-center">
          <Text className="text-center text-white text-md font-medium">Iniciar</Text>
        </TouchableOpacity>
      </Box>
    </SafeAreaView> 
  )
}