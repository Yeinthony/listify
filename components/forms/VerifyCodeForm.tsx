import { TouchableOpacity } from "react-native";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
import { FormControl, FormControlError, FormControlErrorText } from "../ui/form-control";
import { OtpInput } from "../inputs/OtpInput";
import { Center } from "../ui/center";
import { useVerifyCode } from "@/hooks/Forms/useVerifyCode";
import { Controller } from "react-hook-form";
import { VerifyCodeProps } from "@/types/components/forms/verify-code";

export default function(props: VerifyCodeProps) {
  const { 
    control,
    errors,
    onSubmit
  } = useVerifyCode({ onAction: props.onAction })

  return (
    <VStack space="xl">
      <VStack className="justify-center mb-6">
        <Heading className="text-center text-[22px] font-medium">
          Verificación de correo
        </Heading>
        <Text className="text-center text-[14px] text-typography-600 flex-1">
          Ingresa el código enviado a tu correo.
        </Text>
        <HStack space="xs" className="justify-center">
          <Text className="text-center text-[14px] text-typography-600">¿Problemas? </Text>
          <TouchableOpacity 
            onPress={() => {}}
            className="flex items-end justify-end"
          >
            <Text className="text-[14px] text-center text-primary-500 font-medium">
              Pide uno nuevo
            </Text>
          </TouchableOpacity>
        </HStack>
      </VStack>
      <FormControl
        size="md"
        isRequired={true}
        isInvalid={!!errors.code}
      >
        
        <Controller 
          name="code" 
          control={control} 
          render={({ field: { onChange, value } }) => ( 
            <OtpInput 
              value={value} 
              onChange={onChange} 
              error={!!errors.code}
            />
          )} 
        />
        <FormControlError className="pl-3">
          <FormControlErrorText>
            { errors.code?.message }
          </FormControlErrorText>
        </FormControlError>
      </FormControl>
      <HStack className="w-full justify-between">
        {props.backButton}
        <TouchableOpacity  
          onPress={onSubmit}
          className={`mb-2 mt-3 ${!!props.backButton ? 'w-[60%]' : 'w-full'}`}
        >
          <Center 
            className={
              `bg-primary-500 rounded-2xl px-4 h-14`
            }
          >
            <Text className="font-medium text-white">
              Confirmar
            </Text>
          </Center>
        </TouchableOpacity>
        </HStack>
    </VStack>
  )
}