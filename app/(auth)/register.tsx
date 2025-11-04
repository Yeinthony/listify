import { VStack } from "@/components/ui/vstack";
import RegisterForm from "@/components/forms/RegisterForm";

export default function Signin() {
  return(
    <VStack className="flex-1 px-8">
      <RegisterForm />
    </VStack>
  )
}