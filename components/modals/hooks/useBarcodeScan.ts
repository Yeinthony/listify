import { Bounds, ProductLight } from "@/api/types/products";
import { useSpinnerModal } from "@/contexts/SpinnerModalContext";

import { Skia } from "@shopify/react-native-skia";
import { BarcodeScanningResult, CameraType, useCameraPermissions } from "expo-camera";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions } from "react-native";
import { getProductByEanLight } from "@/api/products.api";
import { LightProduct } from "@/types/products";
import useSnackbarStore from "@/store/snackbarStore";


export const useBarcodeScan = (isOpen: boolean) => {
  const { height, width } = Dimensions.get('window');
  const { t } = useTranslation()
  const { showSnackbar } = useSnackbarStore()
  const [permission, requestPermission] = useCameraPermissions();
  const showSpinnerModal = useSpinnerModal();

  const [facing] = useState<CameraType>('back');
  const [eanScanned, setEanScanned] = useState(''); 
  const [product, setProduct] = useState<ProductLight | null>(null)
  const [detectedBounds, setDetectedBounds] = useState<Bounds | null>(null);

  // Rectángulo central de escaneo
  const RECT_W = width - 60;
  const RECT_H = 200;
  const RECT_X = (width - RECT_W) / 2;
  const RECT_Y = (height - RECT_H) / 2;

  const CORNER_SIZE = 30;
  const CORNER_RADIUS = 13;

  const handleBarcodeScanned = useCallback((result: BarcodeScanningResult) => {
    if (!result.cornerPoints || result.cornerPoints.length === 0 || result.data === eanScanned) {
      return; 
    }

    const xs = result.cornerPoints.map(p => p.x);
    const ys = result.cornerPoints.map(p => p.y);

    // REFLEJAR HORIZONTALMENTE (ajusta +120 si es necesario; prueba con (width - 60) - px)
    const flippedXs = xs.map(px => (width + 120) - px);

    const x = Math.min(...flippedXs);
    const y = Math.min(...ys);
    const w = Math.max(...flippedXs) - x;
    const h = Math.max(...ys) - y;

    //setDetectedBounds({ x, y, width: w, height: h });

    // Validación dentro del rectángulo
    const isInsideRect = flippedXs.every((px, i) => {
      const py = ys[i];
      return px >= RECT_X && px <= RECT_X + RECT_W && py >= RECT_Y && py <= RECT_Y + RECT_H;
    });

    if(isInsideRect) setEanScanned(result.data);

    console.log("Código detectado:", result.data, isInsideRect ? "dentro" : "fuera");
  }, [eanScanned, RECT_X, RECT_Y, RECT_W, RECT_H, width]);

  const loadProductByEan = async() => {
    showSpinnerModal(true)
    try {
      const res = await getProductByEanLight(eanScanned)
      if(res.status === 200) {
        setProduct(res.data)
        if (!res.data) showSnackbar({message: "Producto no encontrado."})
      }
      console.log('Product: ', res);
      
    } catch (error) {
      console.log('Error obteniendo producto por ean', error);
      
    } finally {
      showSpinnerModal(false)
    }
  }

  const getAnimationProps = useCallback(() => {
  const hiddenY = height + 200; // un poco más abajo del borde

  return {
    initial: { y: hiddenY, opacity: 0 },
    animate: product
      ? { y: 0, opacity: 1 }
      : { y: hiddenY, opacity: 0 },
    transition: { type: "timing", duration: 450 }
  };
}, [product, height]);

  // Reset flag al abrir modal
  useEffect(() => {
    if (isOpen) {
      setDetectedBounds(null);
      setEanScanned('')
      setProduct(null)
      if (permission && !permission.granted) requestPermission();
    }
  }, [isOpen]);

  useEffect(() => {
    if(eanScanned) {
      loadProductByEan()
    }
  }, [eanScanned])

  const rectPath = useMemo(() => {
    const p = Skia.Path.Make();
    p.addRRect(
      Skia.RRectXY(Skia.XYWHRect(RECT_X, RECT_Y, RECT_W, RECT_H), 10, 10)
    );
    return p;
  }, [RECT_X, RECT_Y, RECT_W, RECT_H]);
  

  return {
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
  }
}