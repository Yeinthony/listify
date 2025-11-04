import { VerifyCodeProps } from "@/types/components/forms/verify-code";
import { verifyCodeScheme } from "@/utils/formSchemes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react"
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next"; 

export const useVerifyCode = ({ onAction }: VerifyCodeProps) => {
  const { t } = useTranslation()
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(verifyCodeScheme(t)),
    defaultValues: {
      code: '',
    },
  });

  const [verifyCode, setVerifyCode] = useState<string>('')

  const onSubmit = handleSubmit(async(data) => {
    onAction(data.code)
  })

  return {
    control,
    errors,
    verifyCode,
    setVerifyCode,
    onSubmit
  }
}