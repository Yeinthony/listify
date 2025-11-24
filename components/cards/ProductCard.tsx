import { LightProduct } from "@/types/products"
import { HStack } from "../ui/hstack"
import { Image } from "../ui/image"
import { ProductCardProps, ProductLight } from "@/api/types/products"
import { Box } from "../ui/box"
import { VStack } from "../ui/vstack"
import { Heading } from "../ui/heading"
import { Text } from "../ui/text"
import helpers from "@/utils/helpers"
import { TouchableOpacity, View } from "react-native"
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


export const ProductCard = (props: ProductCardProps) => {
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
            <Heading className="text-[15px] font-semibold uppercase">
              {props.data.product.name} 
            </Heading>
            <HStack space="sm" className="flex-1 items-center">
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
              <HStack space="sm" className="">
                <TouchableOpacity>
                  <HStack  
                    className="bg-primary-500 px-4 py-1.5 rounded-xl justify-center items-center"
                  >
                    <Text className="text-xs text-white">Ver mas</Text>
                  </HStack>
                </TouchableOpacity>
                <TouchableOpacity>
                  <HStack  
                    className="bg-primary-500 px-4 py-1.5 rounded-xl justify-center items-center"
                  >
                    <Text className="text-xs text-white">Agregar</Text>
                  </HStack>
                </TouchableOpacity>
              </HStack>
            </HStack>        
          </VStack>
        </>
      )}
    </HStack>
  )
}