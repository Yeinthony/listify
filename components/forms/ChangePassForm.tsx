import { TouchableOpacity } from "react-native";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
import { FormControl, FormControlError, FormControlErrorText } from "../ui/form-control";
import { OtpInput } from "../inputs/OtpInput";
import { Center } from "../ui/center";
import { useVerifyCode } from "./hooks/useVerifyCode";
import { Controller } from "react-hook-form";
import { VerifyCodeFormProps, VerifyCodeProps } from "@/components/forms/types/verify-code";
import { useChangePass } from "./hooks/useChangePass";
import { ChangePassProps } from "./types/change-pass";
import { Input, InputField, InputIcon, InputSlot } from "../ui/input";
import { EyeIcon, EyeOffIcon } from "../ui/icon";

export default function({ onSuccess, email, noTitle = false }: ChangePassProps) {
  const { 
    t,
    control,
    errors,
    showPassword,
    showPasswordConfirm,
    handleShowPassword,
    handleShowPasswordConfirm,
    onSubmit
  } = useChangePass({ onSuccess, email })

  return (
    <VStack space="xl">
      {!noTitle && (
        <VStack className="justify-center">
          <Heading className="text-center text-[22px] font-medium">
            Establece tu contraseña
          </Heading>
          <Text className="text-center text-[14px] text-typography-600">
            La contraseña debe tener minimo 6 caracteres
          </Text>
        </VStack>
      )}
      <VStack space="sm">
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
        <FormControl
          isInvalid={!!errors.passwordConfirm}
          size="md"
          isRequired={true}
        >
          <Input className="my-1 rounded-2xl h-14 bg-background-0" size="lg">
            <Controller 
              name="passwordConfirm" 
              control={control} 
              render={({ field: { onChange, value } }) => ( 
                <>
                  <InputField 
                    placeholder={t('input.placeholder.confirmPassword')} 
                    className="text-md"
                    value={value} 
                    onChangeText={onChange} 
                    type={showPasswordConfirm ? "text" : "password"}
                  /> 
                  <InputSlot className="pr-3" onPress={handleShowPasswordConfirm}>
                    <InputIcon as={showPasswordConfirm ? EyeIcon : EyeOffIcon} />
                  </InputSlot>
                </>
              )} 
            />
          </Input>
          <FormControlError>
            <FormControlErrorText>
              { errors.passwordConfirm?.message }
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
              {t('button.accept')}
            </Text>
          </Center>
        </TouchableOpacity>
      </VStack>
    </VStack>
  )
}