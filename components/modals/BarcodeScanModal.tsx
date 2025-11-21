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
import { Dimensions, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import { CameraView, CameraType, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { useEffect, useMemo, useState } from 'react';
import { Canvas, Skia, Rect, Group, RoundedRect } from '@shopify/react-native-skia';
import { VStack } from '../ui/vstack';
import { HStack } from '../ui/hstack';
import Ionicons from '@expo/vector-icons/Ionicons';

export const BarcodeScanModal = ({ isOpen, onClose }: ModalProps) => {
  const { height, width } = Dimensions.get('window');
  const colorScheme = useColorScheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing] = useState<CameraType>('back');

  // Rectángulo central de escaneo
  const RECT_W = width - 60;
  const RECT_H = 200;
  const RECT_X = (width - RECT_W) / 2;
  const RECT_Y = (height - RECT_H) / 2;

  const CORNER_SIZE = 30;
  const CORNER_RADIUS = 13;

  const [detectedBounds, setDetectedBounds] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  const handleBarcodeScanned = (result: BarcodeScanningResult) => {
    if (!result.cornerPoints || result.cornerPoints.length === 0) return;

    const xs = result.cornerPoints.map(p => p.x);
    const ys = result.cornerPoints.map(p => p.y);

    // REFLEJAR HORIZONTALMENTE
    const flippedXs = xs.map(px => (width + 120) - px);

    const x = Math.min(...flippedXs);
    const y = Math.min(...ys);
    const w = Math.max(...flippedXs) - x;
    const h = Math.max(...ys) - y;

    setDetectedBounds({ x, y, width: w, height: h });

    // Validación dentro del rectángulo
    const isInsideRect = flippedXs.every((px, i) => {
      const py = ys[i];
      return px >= RECT_X && px <= RECT_X + RECT_W && py >= RECT_Y && py <= RECT_Y + RECT_H;
    });

    console.log("Código detectado:", result.data, isInsideRect ? "dentro" : "fuera");
  };

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, []);

  const rectPath = useMemo(() => {
    const p = Skia.Path.Make();
    p.addRRect(
      Skia.RRectXY(Skia.XYWHRect(RECT_X, RECT_Y, RECT_W, RECT_H), 10, 10)
    );
    return p;
  }, [RECT_X, RECT_Y, RECT_W, RECT_H]);

  if (!isOpen) return null;
  if (!permission?.granted) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading>Esperando permisos</Heading>
            <ModalCloseButton>
              <Icon as={CloseIcon} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <Text>Permisos denegados</Text>
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
            {detectedBounds && (
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
            )}
          </Group>
        </Canvas>

        {/* Esquinas del rectángulo */}
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
              Asegurese de colocar el código de barras dentro del rectángulo
            </Heading>
          </VStack>
        </VStack>
      </ModalContent>
    </Modal>
  );
};
 