import { ReactNode } from "react";

export interface SearchTextProps
  extends Omit<
    ComponentPropsWithoutRef<typeof Input>,
    "value" | "onChangeText" | "className"
  > {
  value: string;
  onTextChange: (text: string) => void;
  className?: string;
  icon?: ReactNode
  placeholder?: string
  autoFocus?: boolean
}