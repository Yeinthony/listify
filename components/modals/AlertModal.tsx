import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogBody,
  AlertDialogBackdrop,
} from "@/components/ui/alert-dialog"
import { Box } from "@/components/ui/box"
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading"
import { useTranslation } from "react-i18next"
import { Button, ButtonText } from "@/components/ui/button"
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { useState } from "react"
import Ionicons from '@expo/vector-icons/Ionicons';
import { AlertModalProps, IconColor, IconTypes } from "@/types/components/modals/alert-modal";
import { TouchableOpacity } from "react-native";

const AlertModal = ({
  isOpen, 
  type = 'info', 
  title = '', 
  description = '',
  onClose, 
  onAction, 
}: AlertModalProps) => {
  const { t } = useTranslation()
  
  const iconColor: IconColor = {
    info: "#0DA6F2",
    warning: "#facc15",
    error: "#E63535"
  }

  const icon: IconTypes = {
    info: "information-circle-outline",
    warning: "warning-outline",
    error: "trash-outline"
  }

  return (
    <AlertDialog 
      isOpen={isOpen}
      onClose={onClose}
      size="md"
    >
      <AlertDialogBackdrop />
      <AlertDialogContent 
        className="w-full max-w-[320px] gap-4 items-center rounded-2xl"
      >
        <Box 
          className={
            `rounded-full h-[52px] w-[52px] items-center justify-center
              ${type === 'info' && 'bg-info-500/30'}
              ${type === 'warning' && 'bg-yellow-400/30'}
              ${type === 'error' && 'bg-background-error'}
            `
          }
        >
          <Ionicons 
            name={icon[type]} 
            size={28} 
            color={iconColor[type]}
          />
        </Box>
        <AlertDialogHeader className="">
          <Heading 
            className="font-medium text-xl"
            size="md"
          >
            {title}
          </Heading>
        </AlertDialogHeader>
        <AlertDialogBody>
          <Text size="md" className="text-center">
            {description}
          </Text>
        </AlertDialogBody>
        <AlertDialogFooter className="mt-5">
          {type === 'error' ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  onClose()
                  setTimeout(() => {
                    onAction()
                  }, 100);
                }}
                className=""
              >
                 <Center className={
                    `rounded-2xl h-12 w-full px-[30px]
                      ${type === 'error' && 'bg-error-500'}
                     `
                  }
                >
                  <Text className="font-medium text-white text-sm">
                    {t('button.accept')}
                  </Text>
                </Center>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onClose}
                className="px-[30px] rounded-2xl h-12 border-[1.5px] border-typography-600 justify-center items-center"
              >
                <Text>
                  {t('button.cancel')}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
               <TouchableOpacity
                onPress={onClose}
                className="px-[30px] rounded-2xl h-12 border-[1.5px] border-typography-600 justify-center items-center"
              >
                <Text>
                  {t('button.cancel')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  onClose()
                  setTimeout(() => {
                    onAction()
                  }, 100);
                }}
                className=""
              >
                <Center className={
                    `rounded-2xl h-12 w-full px-[30px]
                      ${type === 'info' && 'bg-info-500'}
                      ${type === 'warning' && 'bg-yellow-400'}`
                  }
                >
                  <Text className="font-medium text-white text-sm">
                    {t('button.accept')}
                  </Text>
                </Center>
              </TouchableOpacity>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AlertModal