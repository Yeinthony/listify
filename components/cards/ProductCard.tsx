import { HStack } from "../ui/hstack"
import { Image } from "../ui/image"
import { VStack } from "../ui/vstack"
import { Heading } from "../ui/heading"
import { Text } from "../ui/text"
import { Divider } from "../ui/divider"
import helpers from "@/utils/helpers"
import { TouchableOpacity } from "react-native"
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from "expo-router"
import { useState } from "react"
import { ProductCardProps } from "./types/product-card"
import AddToListModal from "../modals/AddToListModal"
import QuantityPickerModal from "../modals/QuantityPickerModal"
import { useAddToList } from "@/hooks/screens/useAddToList"

const PLACEHOLDER_IMG = 'https://picsum.photos/200/300';

export const ProductCard = (props: ProductCardProps) => {
  const [showAddToList, setShowAddToList] = useState(false)
  const [showQuantity, setShowQuantity] = useState(false)
  const [selectedListId, setSelectedListId] = useState<string | null>(null)
  const { addToList, adding } = useAddToList(() => {
    setShowQuantity(false)
    setSelectedListId(null)
    props.onAdded?.()
  })

  const onAdd = () => {
    if (!props.data) return
    if (props.targetListId) {
      setShowQuantity(true)
    } else {
      setShowAddToList(true)
    }
  }

  const onSelectList = (listId: string) => {
    setSelectedListId(listId)
    setShowAddToList(false)
    setTimeout(() => setShowQuantity(true), 250)
  }

  const onConfirmQuantity = (quantity: number) => {
    const listId = props.targetListId ?? selectedListId
    if (!props.data || !listId) return
    addToList({ listId, productId: props.data.product.id, quantity })
  }

  if (!props.data) return null

  const { product, stats } = props.data

  return (
    <VStack
      className="bg-background-0 rounded-2xl w-full p-4"
      space="md"
      style={{ boxShadow: '0 6px 16px rgba(0, 0, 0, 0.18)', borderCurve: 'continuous' }}
    >
      <HStack space="md" className="items-center">
        <Image
          source={{ uri: product.imageUrl || PLACEHOLDER_IMG }}
          className="w-16 h-16 rounded-xl"
          alt={product.name}
        />
        <VStack className="flex-1">
          <Heading className="text-[15px] font-bold uppercase" numberOfLines={2}>
            {product.name}
          </Heading>
          <Text className="text-sm text-typography-600 capitalize" numberOfLines={1}>
            {[product.brand, `${product.presentationQty} ${product.presentationUnit}`]
              .filter(Boolean)
              .join(' · ')}
          </Text>
        </VStack>
      </HStack>

      <Divider />

      <HStack className="justify-between">
        <VStack className="items-center flex-1" space="xs">
          <Text className="text-xs text-typography-500">Mín</Text>
          <Text
            className="text-success-500 text-lg font-extrabold"
            style={{ fontVariant: ['tabular-nums'] }}
          >
            ${helpers.roundOrDecimals(stats.min)}
          </Text>
        </VStack>
        <VStack className="items-center flex-1" space="xs">
          <Text className="text-xs text-typography-500">Prom</Text>
          <Text
            className="text-lg font-extrabold"
            style={{ fontVariant: ['tabular-nums'] }}
          >
            ${helpers.roundOrDecimals(stats.avg)}
          </Text>
        </VStack>
        <VStack className="items-center flex-1" space="xs">
          <Text className="text-xs text-typography-500">Máx</Text>
          <Text
            className="text-error-500 text-lg font-extrabold"
            style={{ fontVariant: ['tabular-nums'] }}
          >
            ${helpers.roundOrDecimals(stats.max)}
          </Text>
        </VStack>
      </HStack>

      <HStack space="sm" className="mt-1">
        <TouchableOpacity
          className="flex-1 h-12 rounded-2xl border-[1.5px] border-primary-500 items-center justify-center flex-row"
          onPress={() => {
            if (props.onCloseModal) props.onCloseModal()
            router.push({
              pathname: '/main/product-details',
              params: { ean: product.ean },
            })
          }}
        >
          <Text className="text-primary-500 font-medium">Ver más</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 h-12 rounded-2xl bg-primary-500 items-center justify-center flex-row"
          onPress={onAdd}
          disabled={adding}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text className="text-white font-medium ml-1">Agregar</Text>
        </TouchableOpacity>
      </HStack>

      {!props.targetListId && (
        <AddToListModal
          isOpen={showAddToList}
          onClose={() => setShowAddToList(false)}
          onSelect={onSelectList}
        />
      )}

      <QuantityPickerModal
        isOpen={showQuantity}
        onClose={() => setShowQuantity(false)}
        onConfirm={onConfirmQuantity}
        confirming={adding}
      />
    </VStack>
  )
}
