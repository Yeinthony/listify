import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
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
import { StepItem, Stepper } from "../generals/Stepper";
import { useForgotPasswordForm } from "./hooks/useForgotPasswordForm"; 
import { HStack } from "../ui/hstack";
import { OtpInput } from "../inputs/OtpInput";
import { Heading } from "../ui/heading";
import { Link, router } from "expo-router";
import AlertModal from "../modals/AlertModal";
import VerifyCodeForm from "./VerifyCodeForm";
import ChangePassForm from "./ChangePassForm";


export default function ForgotPasswordForm({className}: SigninFormProps) {
  const { t } = useTranslation()
  const {
    step,
    form1,
    showAlertModal,
    setShowAlertModal,
    resendChangePassCode,
    onVerifyCode,
    onBack
  } = useForgotPasswordForm() 

  return(
    <VStack   
      space="sm" 
      className={`w-full ${className}`}
    >
      <Stepper step={step}>
        <StepItem value={1}>
          <VStack space="xl">
            <VStack className="justify-center">
              <Heading className="text-center text-[22px] font-medium">
                Valida tu correo electrónico
              </Heading>
              <Text className="text-center text-[14px] text-typography-600">
                Ingresa el correo asociado a tu cuenta.
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

            <VStack space="sm" className="mt-6">
              <FormControl
                isInvalid={!!form1.errors.email}
                size="md"
                isRequired={true}
              >
                <Input 
                  className="my-1 rounded-2xl h-14 bg-background-0" 
                  size="lg"
                >
                  <Controller 
                    name="email" 
                    control={form1.control} 
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
                    { form1.errors.email?.message }
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>

              <TouchableOpacity  
                onPress={form1.onSubmit}
                className="mb-2 mt-3"
              >
                <Center 
                  className={
                    `bg-primary-500 rounded-2xl px-4 h-14`
                  }
                >
                  <Text className="font-medium text-white">
                    {t('button.next')}
                  </Text>
                </Center>
              </TouchableOpacity>
            </VStack>
          </VStack>
        </StepItem>
        <StepItem value={2}>
          <VerifyCodeForm 
            onAction={onVerifyCode}
            onResend={resendChangePassCode}
          />
        </StepItem>
        <StepItem value={3}>
          <ChangePassForm 
            email={form1.getValues().email}
            onSuccess={() => router.replace('/signin')}
          />
        </StepItem>
      </Stepper>
      <AlertModal 
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        onAction={onBack}
        type="error"
        title="¿Cancelar cambio de contraseña?"
        description="Si confirmás, volverás atrás y no se actualizará tu contraseña."
      />
    </VStack>
  )
}