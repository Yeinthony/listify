import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Link } from "expo-router";

export default function Signin() {
  return(
    <VStack className="flex-1">
      <VStack className="justify-center">
        <Heading className="text-center text-[22px] font-medium">
          Bienvenido a Listify
        </Heading>
        <Text className="text-center text-[14px] text-typography-600">
          ¿Listo para ahorrar en tu próxima compra?
        </Text>
        <HStack space="xs" className="justify-center">
          <Text className="text-center text-[14px] text-typography-600">O</Text>
          <Link className="text-[14px] text-primary-500 font-medium" href="/register">Crea una cuenta</Link>
        </HStack>
      </VStack>
    </VStack>
  )
}