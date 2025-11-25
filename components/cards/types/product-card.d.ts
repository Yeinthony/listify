import { ProductLight } from "@/api/types/products"

interface ProductCardProps {
  data: ProductLight | null
  onCloseModal?: () => void
}