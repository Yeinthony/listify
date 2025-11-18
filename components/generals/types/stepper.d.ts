import { ReactNode } from 'react';

export interface StepItemProps {
  value: string | number;
  children: ReactNode
}

export interface StepperProps {
  step: string | number;
  duration?: number;
  children:
    | ReactElement<StepItemProps>
    | ReactElement<StepItemProps>[];
}
