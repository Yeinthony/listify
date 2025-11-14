import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { register1Scheme, register2Scheme } from '../../utils/formSchemes';
import { useSpinnerModal } from '../../contexts/SpinnerModalContext';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BackHandler, Platform } from 'react-native';
import { useUserStore } from '@/store/userStore';
import useSnackbarStore from '@/store/snackbarStore';
import { SignUpProps } from '@/types/store/user-store';
import { set } from 'zod';

export const useRegisterForm = () => {
  const { signUp, verifyUser } = useUserStore()
  const { showSnackbar } = useSnackbarStore()
  const { t } = useTranslation();
  const showSpinnerModal = useSpinnerModal();
  const params = useLocalSearchParams();
  const router = useRouter()
 
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
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [alertInfo, setAlertInfo] = useState({ 
    title: t('alerts.registerBack.title'),
    message: t('alerts.registerBack.message')
  });

  const stepRef = useRef(step)

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleShowPasswordConfirm = () => {
    setShowPasswordConfirm((prev) => !prev);
  };

  const onRegister = async () => {
    setStep(3)
    // const form1Data = form1.getValues();
    // const form2Data = form2.getValues();

    // const payload: SignUpProps = {
    //   userData: {
    //     email: form1Data.email,
    //     username: form1Data.username,
    //     password: form2Data.password
    //   },
    //   actions: {
    //     spinner: showSpinnerModal,
    //     snackbar: showSnackbar
    //   },
    //   onSuccess: () => setStep(3)
    // }

    // await signUp(payload)
  }

  const onSubmitForm1 = form1.handleSubmit(async (data) => setStep(2));
  const onSubmitForm2 = form2.handleSubmit(async (data) => onRegister());

  const onVerifyCode = async (code: string) => {
    const form1Data = form1.getValues();

    const payload = {
      verifyData: {
        email: form1Data.email,
        code
      },
      actions: {
        spinner: showSpinnerModal,
        snackbar: showSnackbar
      }
    }

    await verifyUser(payload)
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
    if (step === 1) setAlertInfo({
      title: t('alerts.registerBack.title'),
      message: t('alerts.registerBack.message')
    })
    if (step === 3) setAlertInfo({
      title: t('alerts.verifyUser.title'),
      message: t('alerts.verifyUser.message')
    })
  }, [step])

  return {
    form1: {
      control: form1.control,
      errors: form1.formState.errors,
      onSubmit: onSubmitForm1,
      getValues: form1.getValues,
      reset: form1.reset,
    },
    form2: {
      control: form2.control,
      errors: form2.formState.errors,
      onSubmit: onSubmitForm2,
      getValues: form2.getValues,
      reset: form2.reset,
    },
    step,
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
  };
};