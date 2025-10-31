import React, { createContext, useContext, useState } from 'react'; 
import { Center } from "@/components/ui/center"
import { Heading } from "@/components/ui/heading"
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalBody,
} from "@/components/ui/modal"
import { useColorScheme } from '@/components/useColorScheme';
import { VStack } from '@/components/ui/vstack';
import { Spinner } from '@/components/ui/spinner';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Image } from '@/components/ui/image';

const SpinnerMoadalContext = createContext(); 

export const useSpinnerModal = () => { return useContext(SpinnerMoadalContext); };

export const SpinnerModalProvider = ({ children }) => { 
  const colorScheme = useColorScheme()

  const [isVisible, setIsVisible] = useState(false)
  const [description, setDescription] = useState('')
  
  const showSpinnerModal = (isVisibleRef, descriptionRef = '') => { 
    setDescription(descriptionRef)
    setIsVisible(isVisibleRef)
  }; 
  
  return ( 
    <SpinnerMoadalContext.Provider value={showSpinnerModal}> 
      {children} 
      <Modal
        isOpen={isVisible}
        size="xs"
        style={{ zIndex: 9999 }}
      >
        <ModalBackdrop className="bg-black" />
        <ModalContent>
          <ModalBody>
            <Center>
              <VStack className='justify-center items-center'>
                {!description && (
                  colorScheme === 'dark' ? (
                    <Image
                      size="xl"
                      source={require('../assets/icons/LogoDark.png')}
                      alt="image"
                    />
                  ) : (
                    <Image
                      size="xl"
                      source={require('../assets/icons/Logo.png')}
                      alt="image"
                    />
                  )
                )}
                <Spinner size="large" color="#008A99" className='mr-2 mt-2' />
                {description && (
                  <Text className='mt-2'>
                    {description}
                  </Text>
                )}
              </VStack>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </SpinnerMoadalContext.Provider> 
  ); 
};