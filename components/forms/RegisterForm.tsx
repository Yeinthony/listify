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
import { SigninFormProps } from "@/types/components/forms/signin-form";
import { StepItem, Stepper } from "../generals/Stepper";
import { useRegisterForm } from "@/hooks/Forms/useRegisterForm";
import { useState } from "react";
import { HStack } from "../ui/hstack";
import { Divider } from "../ui/divider";
import { OtpInput } from "../inputs/OtpInput";
import { Heading } from "../ui/heading";
import { Link } from "expo-router";
import GoogleIcon from "@/assets/icons/GoogleIcon";
import FacebookIcon from "@/assets/icons/FcebookIcon";
import AlertModal from "../modals/AlertModal";
import VerifyCodeForm from "./VerifyCodeForm";


export default function RegisterForm({className}: SigninFormProps) {
  const { t } = useTranslation()
  const {
    step,
    form1,
    form2,
    showPassword,
    showPasswordConfirm,
    showAlertModal,
    alertInfo,
    setStep,
    handleShowPassword,
    handleShowPasswordConfirm,
    setShowAlertModal,
    onVerifyCode,
    onBack
  } = useRegisterForm() 

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
                Sumate al ahorro
              </Heading>
              <Text className="text-center text-[14px] text-typography-600">
                Registrate y hacé rendir tu dinero.
              </Text>
              <HStack space="xs" className="justify-center">
                <Text className="text-center text-[14px] text-typography-600">O</Text>
                <TouchableOpacity 
                  onPress={() => setShowAlertModal(true)}
                >
                  <Text className="text-[14px] text-primary-500 font-medium">
                    Inicia sesión
                  </Text>
                </TouchableOpacity>
              </HStack>
            </VStack>

            <VStack space="sm" className="mt-6">
              <FormControl
                isInvalid={!!form1.errors.username}
                size="md"
                isRequired={true}
              >
                <Input className="my-1 rounded-2xl h-14 bg-background-0" size="lg">
                  <Controller 
                    name="username" 
                    control={form1.control} 
                    render={({ field: { onChange, value } }) => ( 
                      <>
                        <InputField 
                          placeholder={t('input.placeholder.username')} 
                          className="text-md"
                          value={value} 
                          onChangeText={onChange} 
                        /> 
                      </>
                    )} 
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorText>
                    { form1.errors.username?.message }
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>

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

            <VStack space="xl">
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
          </VStack>
        </StepItem>
        <StepItem value={2}>
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
        </StepItem>
        <StepItem value={3}>
          <VerifyCodeForm 
            onAction={onVerifyCode}
          />
        </StepItem>
      </Stepper>
      <AlertModal 
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        onAction={onBack}
        type="error"
        title={alertInfo.title}
        description={alertInfo.message}
      />
    </VStack>
  )
}