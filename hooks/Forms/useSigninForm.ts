import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from "react";
import { signinScheme } from '../../utils/formSchemes';
import { useSpinnerModal } from '../../contexts/SpinnerModalContext';
import { useTranslation } from "react-i18next";
import { useLocalSearchParams } from "expo-router";
//import useUserStore  from "@/store/userStore"

export const useSigninForm = () => {
  //const signIn = useUserStore(state => state.signIn)
  const showSpinnerModal = useSpinnerModal();
  const { t } = useTranslation()
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
    //signIn(data, showSpinnerModal, reset)
  })

  return {
    control,
    errors,
    showPassword,
    handleShowPassword,
    onSubmit,
    getValues
  }
}