import React from 'react';

export interface VerifyCodeProps {
  onAction: (code: string) => void,
  backButton?: React.ReactNode
}

export interface VerifyCodeFormProps extends VerifyCodeProps {
  onResend: () => void,
}