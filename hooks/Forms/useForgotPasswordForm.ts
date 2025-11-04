import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { register1Scheme, register2Scheme, ForgotPassword1Scheme } from '../../utils/formSchemes';
import { useSpinnerModal } from '../../contexts/SpinnerModalContext';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BackHandler, Platform } from 'react-native';

// import useUserStore from "@/store/userStore"

export const useForgotPasswordForm = () => {
  // const signIn = useUserStore(state => state.signIn)
  const showSpinnerModal = useSpinnerModal();
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const router = useRouter()
 
  const form1 = useForm({
    resolver: zodResolver(ForgotPassword1Scheme(t)),
    defaultValues: {
      email: '',
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
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);

  const stepRef = useRef(step)

  const onSubmitForm1 = form1.handleSubmit(async (data) => {
    setStep(2)
  });

  const onSubmitForm2 = form2.handleSubmit(async (data) => {
    setStep(3)
  });

  const onVerifyCode = (code: string) => {
    console.log('Verification code: ', code);
  }


  const onBack = () => router.back()

  useEffect(() => {
     if (Platform.OS === 'android') {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        if (stepRef.current === 1 || stepRef.current === 3) {
          setShowAlertModal(true)
          return true; 
        }

        if (stepRef.current === 2) {
          setStep(1)
          return true; 
        }
        return false;
      });

      return () => backHandler.remove();
    }
  }, [])

  useEffect(() => {
    stepRef.current = step
  }, [step])

  return {
    form1: {
      control: form1.control,
      errors: form1.formState.errors,
      onSubmit: onSubmitForm1,
      getValues: form1.getValues,
      reset: form1.reset,
    },
    step,
    showAlertModal,
    setStep,
    setShowAlertModal,
    onVerifyCode,
    onBack
  };
};