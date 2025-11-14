import React, {
  createContext,
  useContext,
  useState,
  ReactNode
} from 'react';

import { Center } from "@/components/ui/center";
import { Modal, ModalBackdrop, ModalContent, ModalBody } from "@/components/ui/modal";
import { useColorScheme } from '@/components/useColorScheme';
import { VStack } from '@/components/ui/vstack';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { Image } from '@/components/ui/image';


// ------------------------------------
// 🔵 1. Tipo de la función
// ------------------------------------
export type SpinnerModalFn = (isVisible: boolean, description?: string) => void;


// ------------------------------------
// 🔵 2. Context tipado correctamente
//    (default: no-op function segura)
// ------------------------------------
const SpinnerModalContext = createContext<SpinnerModalFn>(() => {});


// ------------------------------------
// 🔵 3. Hook que retorna la función tipada
// ------------------------------------
export const useSpinnerModal = (): SpinnerModalFn => {
  return useContext(SpinnerModalContext);
};


// ------------------------------------
// 🔵 4. Provider tipado
// ------------------------------------
export const SpinnerModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();

  const [isVisible, setIsVisible] = useState(false);
  const [description, setDescription] = useState<string>("");

  const showSpinnerModal: SpinnerModalFn = (visible, desc = "") => {
    setDescription(desc);
    setIsVisible(visible);
  };

  return (
    <SpinnerModalContext.Provider value={showSpinnerModal}>
      {children}

      <Modal isOpen={isVisible} size="xs" style={{ zIndex: 9999 }}>
        <ModalBackdrop className="bg-black" />

        <ModalContent className='rounded-2xl'>
          <ModalBody>
            <Center>
              <VStack className="justify-center items-center">

                {!description && (
                  colorScheme === 'dark' ? (
                    <Image
                      size="md"
                      source={require('../assets/icons/LogoDark.png')}
                      alt="image"
                    />
                  ) : (
                    <Image
                      size="md"
                      source={require('../assets/icons/Logo.png')}
                      alt="image"
                    />
                  )
                )}

                <Spinner 
                  size="large" 
                  className="mr-2 mt-3" 
                  color="#e44b5e"
                />

                {description && (
                  <Text className="mt-2">{description}</Text>
                )}
              </VStack>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </SpinnerModalContext.Provider>
  );
};