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
import { Link } from "expo-router";
import AlertModal from "../modals/AlertModal";
import VerifyCodeForm from "./VerifyCodeForm";


export default function ForgotPasswordForm({className}: SigninFormProps) {
  const { t } = useTranslation()
  const {
    step,
    form1,
    showAlertModal,
    setStep,
    setShowAlertModal,
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
        {/* <StepItem value={2}>
          <VStack space="xl">
            <VStack className="justify-center">
              <Heading className="text-center text-[22px] font-medium">
                Establece tu contraseña
              </Heading>
              <Text className="text-center text-[14px] text-typography-600">
                La contraseña debe tener minimo 6 caracteres
              </Text>
            </VStack>
            <VStack space="sm">
              <FormControl
                isInvalid={!!form2.errors.password}
                size="md"
                isRequired={true}
              >
                <Input className="my-1 rounded-2xl h-14 bg-background-0" size="lg">
                  <Controller 
                    name="password" 
                    control={form2.control} 
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
                    { form2.errors.password?.message }
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
              <FormControl
                isInvalid={!!form2.errors.passwordConfirm}
                size="md"
                isRequired={true}
              >
                <Input className="my-1 rounded-2xl h-14 bg-background-0" size="lg">
                  <Controller 
                    name="passwordConfirm" 
                    control={form2.control} 
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
                    { form2.errors.passwordConfirm?.message }
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>

              <HStack className="w-full justify-between">
                <TouchableOpacity  
                  onPress={() => setStep(1)}
                  className="mb-2 mt-3 w-[35%]"
                >
                  <Center 
                    className={
                      `bg-primary-500/20 rounded-2xl px-4 h-14`
                    }
                  >
                    <Text className="font-medium text-primary-500">
                      {t('button.back')}
                    </Text>
                  </Center>
                </TouchableOpacity>
                <TouchableOpacity  
                  onPress={form2.onSubmit}
                  className="mb-2 mt-3 w-[60%]"
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
              </HStack>
            </VStack>
          </VStack>
        </StepItem> */}
        <StepItem value={2}>
          <VerifyCodeForm 
            onAction={onVerifyCode}
            onResend={() => {}}
          />
        </StepItem>
      </Stepper>
      <AlertModal 
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        onAction={onBack}
        type="error"
        title="¿Cancelar el registro?"
        description="Si confirmas esta acción, se cancelará el registro y perderás todos los datos que has ingresado hasta ahora. ¿Estás seguro de continuar?"
      />
    </VStack>
  )
}