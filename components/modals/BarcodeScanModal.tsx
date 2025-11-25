import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from '@/components/ui/modal';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Icon, CloseIcon } from '@/components/ui/icon';
import { ModalProps } from "./types/modal";
import { StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import { CameraView } from 'expo-camera';
import { Canvas, Rect, Group, RoundedRect } from '@shopify/react-native-skia';
import { VStack } from '../ui/vstack';
import { HStack } from '../ui/hstack';
import { useBarcodeScan } from './hooks/useBarcodeScan';
import { ProductCard } from '../cards/ProductCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Motion } from '@legendapp/motion';
import Ionicons from '@expo/vector-icons/Ionicons';

const MotionView = Motion.View as any;

export const BarcodeScanModal = ({ isOpen, onClose }: ModalProps) => {
  const colorScheme = useColorScheme();
  const { 
    permission,
    facing,
    rectPath,
    detectedBounds,
    width,
    height,
    CORNER_SIZE,
    CORNER_RADIUS,
    RECT_W,
    RECT_H,
    RECT_X,
    RECT_Y,
    product,
    getAnimationProps,
    handleBarcodeScanned
  } = useBarcodeScan({isOpen, onClose})

  if (!isOpen) return null;

  if (!permission?.granted) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading>Solicitando permisos...</Heading>
            <ModalCloseButton>
              <Icon as={CloseIcon} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <Text>Esperando acceso a la cámara.</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalBackdrop />
      <ModalContent className="flex-1 rounded-2xl border-0">
        <CameraView
          style={StyleSheet.absoluteFill}
          facing={facing}
          barcodeScannerSettings={{ barcodeTypes: ['ean13'] }}
          onBarcodeScanned={handleBarcodeScanned}
        />

        <Canvas style={StyleSheet.absoluteFill}>
          <Group>
            {/* Clip del fondo */}
            <Group clip={rectPath} invertClip>
              <Rect x={0} y={0} width={width} height={height + 40} color="#00000040" />
            </Group>

            {/* Borde del rectángulo */}
            <RoundedRect x={RECT_X} y={RECT_Y} width={RECT_W} height={RECT_H} r={10} color="transparent" />

            {/* Detección de código */}
             {/* {detectedBounds && (
              <RoundedRect
                x={detectedBounds.x}
                y={detectedBounds.y}
                width={detectedBounds.width}
                height={detectedBounds.height}
                r={5}
                color="rgba(0,255,0,0.4)"
                style="stroke"
                strokeWidth={2}
              />
            )} */}
          </Group>
        </Canvas>

        {/* Wrapper para esquinas (mejora layout stability) */}
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          {[
            { left: RECT_X - CORNER_SIZE / 2, top: RECT_Y - CORNER_SIZE / 2, borderTopLeftRadius: CORNER_RADIUS, borderRightColor: 'transparent', borderBottomColor: 'transparent' },
            { left: RECT_X + RECT_W - CORNER_SIZE / 2, top: RECT_Y - CORNER_SIZE / 2, borderTopRightRadius: CORNER_RADIUS, borderLeftColor: 'transparent', borderBottomColor: 'transparent' },
            { left: RECT_X - CORNER_SIZE / 2, top: RECT_Y + RECT_H - CORNER_SIZE / 2, borderBottomLeftRadius: CORNER_RADIUS, borderRightColor: 'transparent', borderTopColor: 'transparent' },
            { left: RECT_X + RECT_W - CORNER_SIZE / 2, top: RECT_Y + RECT_H - CORNER_SIZE / 2, borderBottomRightRadius: CORNER_RADIUS, borderLeftColor: 'transparent', borderTopColor: 'transparent' }
          ].map((corner, idx) => (
            <View
              key={idx}
              style={{
                position: 'absolute',
                width: CORNER_SIZE,
                height: CORNER_SIZE,
                borderWidth: 2,
                backgroundColor: 'transparent',
                ...corner,
                borderColor: 'white',
              }}
            />
          ))}
        </View>
        <VStack className='flex-1 justify-between'>
          <VStack>
            <HStack space="md" className="items-center mt-6">
              <TouchableOpacity 
                onPress={onClose}
                className="bg-background-0 p-2 rounded-xl"
              >
                <Ionicons name="chevron-back" size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
              </TouchableOpacity>
            </HStack>
            <VStack className="mt-16 mx-6">
              <Heading className="text-white text-center font-semibold text-xl">
                Asegúrese de colocar el código de barras dentro del rectángulo
              </Heading>
            </VStack>
          </VStack>

          <SafeAreaView className='mb-4'>
            <MotionView
              {...getAnimationProps()}
              transition={{ type: 'timing', duration: 500 }}
            >
              <ProductCard 
                data={product || null} 
                onCloseModal={onClose}
              />
            </MotionView>
          </SafeAreaView>
        </VStack>
      </ModalContent>
    </Modal>
  );
};
 