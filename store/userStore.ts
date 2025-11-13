import { create } from "zustand";
import { UserState } from "@/types/store/user-store";
import { register } from "@/api/user.api";
import * as SecureStore from 'expo-secure-store';

export const useUserStore = create<UserState>((set) => ({
  user: null,
  signUp: async (signUpData) => {
    const { spinner, snackbar } = signUpData.actions;

    spinner(true);
    try {
      const response = await register(signUpData.userData);
      if (response.status === 201) {
        await SecureStore.setItemAsync('sessionToken', response.data.token);
        set({ user: response.data.user });
        snackbar('Usuario registrado con éxito.', 'success');
      }
    } catch (error) {
      console.log('error registering user:', error);
    } finally {
      spinner(false);
    }
  }
}));