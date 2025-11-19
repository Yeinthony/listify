import { VerifyCodeProps } from "@/components/forms/types/verify-code";
import { register2Scheme, verifyCodeScheme } from "@/utils/formSchemes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react"
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next"; 
import { useUserStore } from "@/store/userStore";
import useSnackbarStore from "@/store/snackbarStore";
import { useSpinnerModal } from "@/contexts/SpinnerModalContext";
import { ChangePassProps } from "../types/change-pass";

export const useChangePass = ({ onSuccess, email }: ChangePassProps) => {
  const { t } = useTranslation()
  const { changePass } = useUserStore()
  const { showSnackbar } = useSnackbarStore()
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(register2Scheme(t)),
    defaultValues: {
      password: '',
      passwordConfirm: ''
    },
  });
  const showSpinnerModal = useSpinnerModal();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState<boolean>(false);

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleShowPasswordConfirm = () => {
    setShowPasswordConfirm((prev) => !prev);
  };

  const onSubmit = handleSubmit(async(data) => {
    const payload = {
      changePassData: {
        password: data.password,
        email,
      },
      actions: {
        spinner: showSpinnerModal,
        snackbar: showSnackbar,
        onSuccess: () => {
          if(onSuccess) onSuccess()
          reset()  
        },
        t
      },
    }

    changePass(payload)
  })

  return {
    t,
    control,
    errors,
    showPassword,
    showPasswordConfirm,
    handleShowPassword,
    handleShowPasswordConfirm,
    onSubmit
  }
}