import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { VStack } from "@/components/ui/vstack";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import { Dimensions, ScrollView, TouchableOpacity, useColorScheme, View } from "react-native";
import { 
  useSharedValue, 
  interpolate, 
  Extrapolation, 
} from "react-native-reanimated";
import Carousel, { Pagination } from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProductDetails } from "@/hooks/screens/useProductDetails";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { Divider } from '@/components/ui/divider';
import { StoreByProductModal } from "@/components/modals/StoreByProductModal";
import helpers from "@/utils/helpers";


export default function ProductDetails() {
  const { 
    bannerImages,
    loading,
    productData,
    showStoreByProductModal,
    selectedStore,
    setShowStoreByProductModal,
    setSelectedStore,
  } = useProductDetails()
  const { t } = useTranslation()
  const colorScheme = useColorScheme();
  const width = Dimensions.get("window").width;
  const progress = useSharedValue(0);

  return (
    <VStack className='flex-1 bg-background-100'>
      {(loading && !productData) ? (
        <Center className="flex-1">
          <Spinner 
            size="large" 
            className="mr-2 mt-3" 
            color="#e44b5e"
          />
        </Center>
      ) : (
        <>
          <VStack className='w-full relative'>
            <View className="mb-4 absolute">
              <Carousel
                autoPlayInterval={2000}
                data={bannerImages}
                height={200}
                loop={false}
                pagingEnabled={true}
                snapEnabled={true}
                width={width}
                onProgressChange={progress}
                renderItem={({ index, item }) => (
                  <View 
                    className="flex-1 relative overflow-hidden"
                  >
                    <Image
                      source={{
                        uri: item.url,
                      }}
                      alt="Logo"
                      size="none"
                      className="flex-1"
                    />
                  </View>
                )}
              />

              <Pagination.Custom
                progress={progress}
                data={bannerImages}
                size={7}
                dotStyle={{
                  borderRadius: 16,
                  backgroundColor: colorScheme === 'dark' ? '#f1f1f180' : '#11111160',
                }}
                activeDotStyle={{
                  borderRadius: 8,
                  width: 20,
                  height: 7,
                  overflow: "hidden",
                  backgroundColor: colorScheme === 'dark' ? '#f1f1f1' : '#111111',
                }}
                containerStyle={{ gap: 5, marginTop: 10 }}
                horizontal
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
            </View>
            <SafeAreaView
              className="w-full h-[200px]"
              pointerEvents="box-none"
            >
              <HStack space="md" className="items-center mx-4">
                <TouchableOpacity 
                  onPress={() => {}}
                  className="bg-background-0 p-2 rounded-xl"
                >
                  <Ionicons name="chevron-back" size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
                </TouchableOpacity>
              </HStack>
            </SafeAreaView>
          </VStack>

          <SafeAreaView className='flex-1'>
            <VStack space="2xl" className='flex-1 mb-2'>
              <VStack className="mx-4">
                <Heading className="text-lg uppercase">
                  {productData?.product.name}
                </Heading>
                <Text className="capitalize">
                  {`${productData?.product.presentationQty} ${productData?.product.presentationUnit}`}
                </Text>
              </VStack>
              <VStack space="sm" className="mx-4">
                <Heading className="text-[14px] font-semibold">
                  Rango de precios
                </Heading>
                <HStack className="items-center justify-between bg-background-0 p-3 rounded-2xl">
                  <VStack className="items-center">
                    <Text>Minimo</Text>
                    <Text className="text-success-500 text-2xl font-extrabold">
                      ${helpers.roundOrDecimals(productData?.stats.min || '')}
                    </Text>
                  </VStack>
                  <VStack className="items-center">
                    <Text>Promedio</Text>
                    <Text className="text-3xl font-extrabold">
                      ${helpers.roundOrDecimals(productData?.stats.avg || '')}
                    </Text>
                  </VStack>
                  <VStack className="items-center">
                    <Text>Maximo</Text>
                    <Text className="text-2xl font-extrabold text-error-500">
                      ${helpers.roundOrDecimals(productData?.stats.max || '')}
                    </Text>
                  </VStack>
                </HStack>
              </VStack>
              <VStack className="flex-1" space="md">
                <HStack className="justify-between items-center mx-4">
                  <Heading className="text-[14px] font-semibold">
                    Disponible en
                  </Heading>
                  <TouchableOpacity className="">
                    <Text className="text-md text-primary-500 font-medium">Ver mapa</Text>
                  </TouchableOpacity>
                </HStack>
                <ScrollView className="flex-1">
                  <VStack className='bg-background-0 rounded-2xl mx-4'>
                    {productData?.availableStores.map((store) => (
                      <VStack key={store.id}>
                        <TouchableOpacity 
                          className='px-4 py-3'
                          onPress={() => {
                            setSelectedStore(store)
                            setShowStoreByProductModal(true)
                          }}
                        >
                          <HStack className='items-center justify-between'>
                            <HStack 
                              className='items-center flex-1' 
                              space='md'
                            >
                              {/* <Ionicons 
                                name="language-outline" 
                                size={22} 
                                color={colorScheme === 'dark' ? 'white' : 'black'}
                              /> */}
                              <Text className='text-md'>
                                {store.name}
                              </Text>
                            </HStack>
                            <Ionicons 
                              name="chevron-forward-outline" 
                              size={20} 
                              color={colorScheme === 'dark' ? 'white' : 'black'}
                            />
                          </HStack>
                        </TouchableOpacity>
                        
                        {productData.availableStores[productData.availableStores.length - 1].id !== store.id && (<Divider className="w-[95%] self-center" />)}
                      </VStack>
                    ))}
                  </VStack>
                </ScrollView>
              </VStack>
              <TouchableOpacity className="mx-4">
                <HStack 
                  className="w-full h-14 rounded-2xl bg-primary-500 justify-center items-center"
                  space="md"
                >
                  <Ionicons 
                    name="add-circle-outline" 
                    size={26} 
                    color="white"
                  />
                  <Text className="text-white text-md">
                    Agregar a lista
                  </Text>
                </HStack>
              </TouchableOpacity>
            </VStack>
          </SafeAreaView>
          <StoreByProductModal 
            isOpen={showStoreByProductModal}
            ean={productData?.product.ean || ''} 
            store={selectedStore}
            onClose={() => setShowStoreByProductModal(false)}
          />
        </>
      )}
    </VStack>
  )
}