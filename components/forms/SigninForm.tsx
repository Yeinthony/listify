import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useSigninForm } from "./hooks/useSigninForm";
import { useTranslation } from "react-i18next";
import { 
  FormControl, 
  FormControlError, 
  FormControlErrorText, 
} from "@/components/ui/form-control";
import { 
  Input, 
  InputField, 
  InputIcon, 
  InputSlot 
} from "@/components/ui/input";
import { Controller } from "react-hook-form";
import {
  EyeIcon,
  EyeOffIcon,
} from "@/components/ui/icon";
import { TouchableOpacity } from "react-native";
import { Center } from "@/components/ui/center";
import { SigninFormProps } from "@/components/forms/types/signin-form";
import { Link } from "expo-router";


export default function SigninForm({className}: SigninFormProps) {
  const { t } = useTranslation()
  const {
    control,
    errors,
    showPassword,
    handleShowPassword,
    onSubmit,
    toForgotPassword
  } = useSigninForm() 

  return(
    <VStack   
      space="sm" 
      className={`w-full ${className}`}
    >
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
                placeholder={t('input.placeholder.email')}
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
                  placeholder={t('input.placeholder.password')} 
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

      <TouchableOpacity
        onPress={toForgotPassword}
      >
        <Text 
          className="text-[14px] text-center text-primary-500 font-medium" 
        >
          {t('link.forgotPassword')}
        </Text>
      </TouchableOpacity>
    </VStack>
  )
}