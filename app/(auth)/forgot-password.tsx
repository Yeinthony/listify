import { VStack } from "@/components/ui/vstack";
import ForgotPasswordForm from "@/components/forms/ForgotPasswordForm";

export default function ForgotPassword() {
  return(
    <VStack className="flex-1 px-8">
      <ForgotPasswordForm />
    </VStack>
  )
}