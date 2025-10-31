import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Link } from "expo-router";
import { useSignin } from "@/hooks/screens/useSignin";
import { useTranslation } from "react-i18next";
import { 
  FormControl, 
  FormControlError, 
  FormControlErrorText, 
  FormControlLabel, 
  FormControlLabelText 
} from "@/components/ui/form-control";
import { 
  Input, 
  InputField, 
  InputIcon, 
  InputSlot 
} from "@/components/ui/input";
import { Controller } from "react-hook-form";
import {
  ArrowLeftIcon,
  EyeIcon,
  EyeOffIcon,
  Icon,
} from "@/components/ui/icon";
import { TouchableOpacity, KeyboardAvoidingView } from "react-native";
import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import GoogleIcon from "@/assets/icons/GoogleIcon";
import FacebookIcon from "@/assets/icons/FcebookIcon";

export default function Signin() {
  const { t } = useTranslation()
  const {
    control,
    errors,
    showPassword,
    handleShowPassword,
    onSubmit,
    getValues
  } = useSignin() 

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
        <FormControl
          isInvalid={!!errors.email}
          size="md"
          isRequired={true}
        >
          <Input 
            className="my-1 rounded-2xl h-14 bg-background-0" 
            size="lg"
          >
            <Controller 
              name="email" 
              control={control} 
              render={({ field: { onChange, value } }) => ( 
                <InputField 
                  className="text-md"
                  placeholder={t('input.label.email')}
                  value={value} 
                  onChangeText={onChange} 
                /> 
              )} 
            />
          </Input>
          <FormControlError>
            <FormControlErrorText>
              { errors.email?.message }
            </FormControlErrorText>
          </FormControlError>
        </FormControl>

        <FormControl
          isInvalid={!!errors.password}
          size="md"
          isRequired={true}
        >
          <Input className="my-1 rounded-2xl h-14 bg-background-0" size="lg">
            <Controller 
              name="password" 
              control={control} 
              render={({ field: { onChange, value } }) => ( 
                <>
                  <InputField 
                    placeholder={t('input.label.password')} 
                    className="text-md"
                    value={value} 
                    onChangeText={onChange} 
                    type={showPassword ? "text" : "password"}
                  /> 
                  <InputSlot className="pr-3" onPress={handleShowPassword}>
                    <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                  </InputSlot>
                </>
              )} 
            />
          </Input>
          <FormControlError>
            <FormControlErrorText>
              { errors.password?.message }
            </FormControlErrorText>
          </FormControlError>
        </FormControl>

        <TouchableOpacity  
          onPress={onSubmit}
          className="mb-2 mt-3"
        >
          <Center 
            className={
              `bg-primary-500 rounded-2xl px-4 h-14`
            }
          >
            <Text className="font-medium text-white">
              {t('button.signin')}
            </Text>
            </Center>
        </TouchableOpacity>
        <Link 
          className="text-[14px] text-center text-primary-500 font-medium" 
          href="/register"
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