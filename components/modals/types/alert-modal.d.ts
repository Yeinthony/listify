export interface AlertModalProps {
  isOpen: boolean,
  onClose: () => void,
  onAction: () => void,
  type: 'info' | 'warning' | 'error',
  title: string,
  description?: string
}

export interface IconColor {
  info: "#0DA6F2",
  warning: "#facc15",
  error: "#E63535"
}

export interface IconTypes {
  info: "information-circle-outline",
  warning: "warning-outline",
  error: "trash-outline"
}