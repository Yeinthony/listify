import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { register1Scheme, register2Scheme } from '../../utils/formSchemes';
import { useSpinnerModal } from '../../contexts/SpinnerModalContext';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams } from 'expo-router';

// import useUserStore from "@/store/userStore"

export const useRegisterForm = () => {
  // const signIn = useUserStore(state => state.signIn)
  const showSpinnerModal = useSpinnerModal();
  const { t } = useTranslation();
  const params = useLocalSearchParams();

  const form1 = useForm({
    resolver: zodResolver(register1Scheme(t)),
    defaultValues: {
      email: '',
      username: '',
    },
  });

  const form2 = useForm({
    resolver: zodResolver(register2Scheme(t)),
    defaultValues: {
      password: '',
      passwordConfirm: ''
    },
  });

  const [step, setStep] = useState<number>(1)
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState<boolean>(false);
  const [verifyCode, setVerifyCode] = useState<string>('')

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleShowPasswordConfirm = () => {
    setShowPasswordConfirm((prev) => !prev);
  };

  const onSubmitForm1 = form1.handleSubmit(async (data) => {
    setStep(2)
  });

  const onSubmitForm2 = form2.handleSubmit(async (data) => {
    setStep(3)
  });

  return {
    // 🔸 Form 1
    form1: {
      control: form1.control,
      errors: form1.formState.errors,
      onSubmit: onSubmitForm1,
      getValues: form1.getValues,
      reset: form1.reset,
    },

    // 🔸 Form 2
    form2: {
      control: form2.control,
      errors: form2.formState.errors,
      onSubmit: onSubmitForm2,
      getValues: form2.getValues,
      reset: form2.reset,
    },

    // 🔸 Estados compartidos
    step,
    showPassword,
    showPasswordConfirm,
    verifyCode,
    setStep,
    handleShowPassword,
    handleShowPasswordConfirm,
    setVerifyCode,
  };
};