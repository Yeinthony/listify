import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { ForgotPassword1Scheme } from '@/utils/formSchemes';
import { useSpinnerModal } from '@/contexts/SpinnerModalContext';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BackHandler, Platform } from 'react-native';
import { useUserStore } from '@/store/userStore';
import useSnackbarStore from '@/store/snackbarStore';

export const useForgotPasswordForm = () => {
  const { sendCodeChangePass, verifyPassCode, resendPassCode } = useUserStore()
  const { showSnackbar } = useSnackbarStore()
  const { t } = useTranslation();
  const showSpinnerModal = useSpinnerModal();
  const params = useLocalSearchParams();
  const router = useRouter()

  const emailParam = Array.isArray(params.email) ? params.email[0] : params.email || "";
 
  const form1 = useForm({
    resolver: zodResolver(ForgotPassword1Scheme(t)),
    defaultValues: {
      email: emailParam,
    },
  });

  const [step, setStep] = useState<number>(1)
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);

  const stepRef = useRef(step)

  const onSubmitForm1 = form1.handleSubmit(async (data) => {
    const payload = {
      data: {
        email: data.email
      },
      actions: {
        spinner: showSpinnerModal,
        snackbar: showSnackbar,
        t,
        onSuccess: () => setStep(2)
      }
    }

    sendCodeChangePass(payload)
  });

  const resendChangePassCode = () => {
    const form1Data = form1.getValues();

    const payload = {
      data: {
        email: form1Data.email
      },
      actions: {
        spinner: showSpinnerModal,
        snackbar: showSnackbar
      }
    }
    resendPassCode(payload)
  }

  const onVerifyCode = (code: string) => {
    console.log('Verification code: ', code);
    const form1Data = form1.getValues()

    const payload = {
      verifyData: {
        email: form1Data.email,
        code: code
      },
      actions: {
        spinner: showSpinnerModal,
        snackbar: showSnackbar,
        t,
        onSuccess: () => setStep(3)
      }
    }

    verifyPassCode(payload)
  }


  const onBack = () => router.back()

  useEffect(() => {
    console.log('params: ', params);
    

    if (Platform.OS === 'android') {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        if (stepRef.current === 2 || stepRef.current === 3) {
          setShowAlertModal(true)
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
    resendChangePassCode,
    onVerifyCode,
    onBack
  };
};