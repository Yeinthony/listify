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
          Sumate al ahorro
        </Heading>
        <Text className="text-center text-[14px] text-typography-600">
          Registrate y hacé rendir tu dinero.
        </Text>
        <HStack space="xs" className="justify-center">
          <Text className="text-center text-[14px] text-typography-600">O</Text>
          <Link 
            className="text-[14px] text-primary-500 font-medium" 
            href="/signin"
          >
            Inicia sesión
          </Link>
        </HStack>
      </VStack>
    </VStack>
  )
}