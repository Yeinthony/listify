import React from 'react';

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  scroll?: boolean;
}