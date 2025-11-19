import React from 'react';

export interface ChangePassProps {
  onSuccess?: () => void,
  noTitle?: boolean,
  email: string
}
