import { HStack } from "../ui/hstack"
import { Image } from "../ui/image"
import { Box } from "../ui/box"
import { VStack } from "../ui/vstack"
import { Heading } from "../ui/heading"
import { Text } from "../ui/text"
import helpers from "@/utils/helpers"
import { TouchableOpacity, View } from "react-native"
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from "expo-router"
import { useState } from "react"
import { ProductCardProps } from "./types/product-card"
import AddToListModal from "../modals/AddToListModal"


export const ProductCard = (props: ProductCardProps) => {
  const [showAddToList, setShowAddToList] = useState(false)

  return (
    <HStack 
      className="bg-background-0 rounded-2xl w-full overflow-hidden relative h-[120px]"
      space="xs"
    >
      {props.data && (
        <>
          <View 
            className="w-[90px] h-full"
          >
            <Image
              source={{
                uri: 'https://picsum.photos/200/300',
              }}
              className="flex-1 w-full"
              alt="phone-1"
            />
          </View>
          <VStack className="flex-1 p-2 justify-between">
            <Heading className="text-[13px] font-bold uppercase">
              {props.data.product.name} 
            </Heading>
            <HStack className="flex-1 items-center justify-between">
              <Text className="text-success-500 text-lg font-extrabold">
                ${helpers.roundOrDecimals(props.data.stats.min)}
              </Text>
              <Text className="text-xl font-extrabold">
                ${helpers.roundOrDecimals(props.data.stats.avg)}
              </Text>
              <Text className="text-error-500 text-lg font-extrabold">
                ${helpers.roundOrDecimals(props.data.stats.max)}
              </Text>
            </HStack>
            <HStack className="justify-between items-center">
              <Text className="capitalize text-sm font-medium">
                {`${props.data.product.presentationQty} ${props.data.product.presentationUnit}`}
              </Text>
              <HStack space="xs" className="">
                <TouchableOpacity
                  onPress={() => {
                    if(props.onCloseModal) props.onCloseModal()
                    router.push({
                      pathname: '/main/product-details',
                      params: {
                        ean: props.data.product.ean
                      }
                    })
                  }}
                >
                  <HStack  
                    className="bg-primary-500 px-4 py-1.5 rounded-xl justify-center items-center"
                  >
                    <Text className="text-sm text-white">Ver mas</Text>
                  </HStack>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowAddToList(true)}>
                  <HStack
                    className="bg-primary-500 px-4 py-1.5 rounded-xl justify-center items-center"
                  >
                    <Text className="text-sm text-white">Agregar</Text>
                  </HStack>
                </TouchableOpacity>
              </HStack>
            </HStack>
          </VStack>
          <AddToListModal
            isOpen={showAddToList}
            onClose={() => setShowAddToList(false)}
            productId={props.data.product.id}
          />
        </>
      )}
    </HStack>
  )
}