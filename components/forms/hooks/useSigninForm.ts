import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from "react";
import { signinScheme } from '@/utils/formSchemes';
import { useSpinnerModal } from '@/contexts/SpinnerModalContext';
import { useTranslation } from "react-i18next";
import { router, useLocalSearchParams } from "expo-router";
import { useUserStore } from '@/store/userStore';

export const useSigninForm = () => {
  const { signin } = useUserStore()
  const { t } = useTranslation()
  const showSpinnerModal = useSpinnerModal();
  const params = useLocalSearchParams();
  const emailParam = Array.isArray(params.email) ? params.email[0] : params.email || "";

  const { control, handleSubmit, formState: { errors }, reset, getValues } = useForm({
    resolver: zodResolver(signinScheme(t)),
    defaultValues: { 
      email: emailParam, 
      password: "" 
    }
  })

  const [showPassword, setShowPassword] = useState(false)

  const handleShowPassword = () => {
    setShowPassword((showState) => {
      return !showState
    })
  }

  const onSubmit = handleSubmit(async(data) => {
    const payload = {
      signinData: data,
      spinner: showSpinnerModal
    }
    signin(payload)
  })

  const toForgotPassword = () =>{
    router.push({
      pathname: '/forgot-password',
      params: {
        email: getValues().email
      }
    })
  }

  return {
    control,
    errors,
    showPassword,
    handleShowPassword,
    onSubmit,
    toForgotPassword
  }
}