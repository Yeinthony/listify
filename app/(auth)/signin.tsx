import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Link } from "expo-router";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";
import { Divider } from "@/components/ui/divider";
import GoogleIcon from "@/assets/icons/GoogleIcon";
import FacebookIcon from "@/assets/icons/FcebookIcon";
import SigninForm from "@/components/forms/SigninForm";

export default function Signin() {
  const { t } = useTranslation()

  return(
    <VStack space="xl" className="flex-1 px-8">
      <VStack className="justify-center">
        <Heading className="text-center text-[22px] font-medium">
          Bienvenido a Listify
        </Heading>
        <Text className="text-center text-[14px] text-typography-600">
          ¿Listo para ahorrar en tu próxima compra?
        </Text>
        <HStack space="xs" className="justify-center">
          <Text className="text-center text-[14px] text-typography-600">O</Text>
          <Link 
            className="text-[14px] text-primary-500 font-medium" 
            href="/register"
          >
            Crea una cuenta
          </Link>
        </HStack>
      </VStack>
      <VStack space="sm" className="w-full mt-6">
        <SigninForm />
        <Link 
          className="text-[14px] text-center text-primary-500 font-medium" 
          href="/forgot-password"
        >
          {t('link.forgotPassword')}
        </Link>
      </VStack>
      <HStack className="justify-between items-center">
        <Divider className="my-0.5 w-[45%] bg-typography-300" />
        <Text className="text-[14px] text-typography-600">O</Text>
        <Divider className="my-0.5 w-[45%] bg-typography-300" />
      </HStack>
      <VStack className="mt-2">
        <TouchableOpacity  
          onPress={() => {}}
          className="mb-2"
        >
          <HStack 
            className={
              `bg-background-0 rounded-2xl px-4 h-14 items-center`
            }
          >
            <GoogleIcon />
            <Text className="flex-1 font-medium text-center">
              Continuar con google
            </Text>
          </HStack>
        </TouchableOpacity>
        <TouchableOpacity  
          onPress={() => {}}
          className="mb-2"
        >
          <HStack 
            className={
              `bg-background-0 rounded-2xl px-4 h-14 items-center`
            }
          >
            <FacebookIcon />
            <Text className="flex-1 font-medium text-center">
              Continuar con facebook
            </Text>
          </HStack>
        </TouchableOpacity>
      </VStack>
    </VStack>
  )
}