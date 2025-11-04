import { ContainerProps } from '@/types/components/generals/container';
import React from 'react';
import { KeyboardAvoidingView, RefreshControl, ScrollView, View, Platform } from 'react-native';

export const Container: React.FC<ContainerProps> = ({
  children, 
  className = '', // Default a cadena vacía para evitar "undefined" en className
  isRefreshing = false, 
  onRefresh, 
  scroll = false, // Default a false si no se pasa
}) => {
  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      {scroll ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={isRefreshing}
              onRefresh={onRefresh} 
            />
          }
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View className={`flex-1 ${className}`}>
            {children}
          </View>
        </ScrollView>
      ) : (
        <View className={`flex-1 ${className}`}>
          {children}
        </View>
      )}
    </KeyboardAvoidingView>
  );
};