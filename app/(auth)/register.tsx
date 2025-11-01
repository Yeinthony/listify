import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Link } from "expo-router";
import RegisterForm from "@/components/forms/RegisterForm";

export default function Signin() {
  return(
    <VStack className="flex-1 px-8">
      <RegisterForm />
    </VStack>
  )
}