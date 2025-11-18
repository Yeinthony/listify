import React, { useEffect } from 'react';
import { useToast, Toast, ToastTitle, ToastDescription } from '@/components/ui/toast';
import { Center } from "@/components/ui/center"
import { HStack } from '@/components/ui/hstack';
import { 
  CloseIcon, 
  HelpCircleIcon, 
  CheckCircleIcon, 
  InfoIcon, 
  CloseCircleIcon, 
  Icon 
} from '@/components/ui/icon';
import { VStack } from '@/components/ui/vstack';
import { Pressable } from '@/components/ui/pressable';
import { StyleOptions } from '@/components/generals/types/snackbar';
import { TouchableOpacity } from 'react-native';
import useSnackbarStore from '@/store/snackbarStore';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const Snackbar = () => {
  const { isVisible, message, type, hideSnackbar, duration } = useSnackbarStore();
  const toast = useToast();

  const stylesOptions: StyleOptions = {
    info: 'mb-14 p-4 gap-6 rounded-2xl border-info-500 w-full bg-info-500 shadow-hard-2 max-w-[350px] flex-row justify-between',
    success: 'mb-14 p-4 gap-6 rounded-2xl border-success-500 w-full bg-success-500 shadow-hard-2 max-w-[350px] flex-row justify-between',
    warning: 'mb-14 p-4 gap-6 rounded-2xl border-warning-500 w-full bg-warning-500 shadow-hard-2 max-w-[350px] flex-row justify-between',
    error: 'mb-14 p-4 gap-6 rounded-2xl border-error-500 w-full bg-error-500 shadow-hard-2 max-w-[350px] flex-row justify-between'
  }

  const iconsOptions: Record<
    "info" | "success" | "warning" | "error",
    keyof typeof MaterialCommunityIcons.glyphMap
  > = {
    info: "information-outline",
    success: "check",
    warning: "alert-outline",
    error: "close-circle-outline"
  };

  useEffect(() => {
    if (isVisible) {

      const styles = stylesOptions[type]
      const icon = iconsOptions[type]

      const toastId = toast.show({
        placement: "bottom",
        duration: duration,
        render: () => (
          <Toast
            className={styles} 
            action={type} 
            style={{ zIndex: 9998 }}
          >
            <HStack space="md" className='items-center'>
              <MaterialCommunityIcons 
                name={icon}
                size={24} 
                color="white" 
              />
              <VStack space="xs">
                <ToastTitle className="font-semibold max-w-[220px] text-white">
                  {message}
                </ToastTitle>
              </VStack>
            </HStack>
            <Center className="">
              <TouchableOpacity onPress={() => {
                hideSnackbar();
                toast.close(toastId);
              }}>
                <Icon as={CloseIcon}  className='text-white' size='xl'/>
              </TouchableOpacity>
            </Center>
          </Toast>
        ),
      });
      hideSnackbar();
    }
  }, [isVisible, message, type, hideSnackbar, toast]);

  return null;
};

export default Snackbar;