import React, { useRef, useState } from "react";
import { TextInput } from "react-native";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";

interface OtpInputProps {
  value: string;
  onChange?: (value: string) => void;
  length?: number;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  length = 6,
}) => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputsRef = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    const char = text.slice(-1);
    const newValue =
    value.substring(0, index) + char + value.substring(index + 1);

    // Mover foco al siguiente campo automáticamente
    if (char && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    if (!onChange) return;
    onChange(newValue);
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !value[index] && index > 0) {
      // Si borra y el campo está vacío, retrocede el foco
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleFocus = (index: number) => setFocusedIndex(index);

  return (
    <HStack space="sm" className="justify-center">
      {Array.from({ length }).map((_, index) => (
        <Input
          key={index}
          className={`my-1 rounded-2xl h-14 w-12 bg-background-0`}
          size="lg"
        >
          <InputField
            ref={(ref) => {
              inputsRef.current[index] = ref as unknown as TextInput | null;
            }}
            value={value[index] || ""}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => handleFocus(index)}
            textAlign="center"
            keyboardType="number-pad"
            maxLength={1}
            autoCorrect={false}
          />
        </Input>
      ))}
    </HStack>
  );
};