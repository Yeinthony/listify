import React, { useRef, useEffect, Children, ReactElement } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Motion } from '@legendapp/motion';
import { StepItemProps, StepperProps } from '@/types/components/generals/stepper';

const { width } = Dimensions.get('window');

const MotionView = Motion.View as any;

// Componente para cada paso individual
export const StepItem = ({ children }: StepItemProps) => {
  return <View style={styles.stepItem}>{children}</View>;
};

// Componente contenedor del stepper
export const Stepper = ({
  step,
  children,
  duration = 500,
}: StepperProps) => {
  // Filtrar solo los hijos válidos
  const steps = Children.toArray(children).filter(
    (child): child is ReactElement<StepItemProps> =>
      React.isValidElement(child)
  );

  // Encontrar el paso actual
  const currentStepIndex = steps.findIndex((stepItem) => {
    return stepItem.props.value === step;
  });
  
  const currentStep = steps[currentStepIndex];

  // Guardar el paso anterior para la animación
  const prevStepRef = useRef(currentStepIndex);

  // Animaciones
  const getAnimationProps = () => {
    if (currentStepIndex === -1) return {};
    if ( prevStepRef.current === 0 && currentStepIndex === 0) {
      return {
        initial: { 
          x: prevStepRef.current === 0 && currentStepIndex === 0
            ? 0 
            : -width, 
          opacity: 0 
        },
        animate: { x: 0, opacity: 1 },
        exit: { x: width, opacity: 0 },
      };
    }else{
      return {
        initial: { 
          x: currentStepIndex > prevStepRef.current 
            ? width 
            : -width,
          opacity: 0, 
        },
        animate: { 
          x: 0,
          opacity: 1, 
        },
        exit: { 
          x: currentStepIndex < prevStepRef.current ? width : -width, 
          opacity: 0
        },
      }
    }
  };

  useEffect(() => {
    prevStepRef.current = currentStepIndex;
  }, [currentStepIndex]);

  if (currentStepIndex === -1) {
    return <View className="flex-1 w-full">{children}</View>;
  }

  return (
    <View  className="flex-1 w-full overflow-hidden">
      <MotionView
        key={`step-${step}`}
        style={styles.animatedContainer}
        {...getAnimationProps()}
        transition={{ type: 'timing', duration }}
      >
        {currentStep}
      </MotionView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
  },
  animatedContainer: {
    width: '100%',
    flex: 1,
  },
  stepItem: {
    width: '100%',
    flex: 1,
  },
});

export default Stepper;