import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input"
import { SearchIcon } from "@/components/ui/icon"
import { SearchTextProps } from "./types/search-text"

export const SearchText: React.FC<SearchTextProps> = ({
  value,
  onTextChange,
  className,
  icon,
  placeholder,
  autoFocus,
  ...props
}) => {
  return (
    <Input
      className={`
        my-1 rounded-2xl h-14 bg-background-0 border-background-0
        ${className}
      `}
      size="lg"
      {...props}
    >
      <InputSlot className="pl-3">
        {icon ? icon : <InputIcon as={SearchIcon} />}
      </InputSlot>
      <InputField
        className="text-sm"
        placeholder={placeholder ?? `Buscar...`}
        autoFocus={autoFocus}
        value={value}
        onChangeText={(text) => onTextChange(text)}
      />
    </Input>
  )
}