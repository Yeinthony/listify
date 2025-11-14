import { create } from "zustand";
import { UserState } from "@/types/store/user-store";
import { register, verifyUser } from "@/api/user.api";
import { login } from "@/api/auth.api";
import * as SecureStore from 'expo-secure-store';

export const useUserStore = create<UserState>((set) => ({
  user: null,
  signUp: async (signUpData) => {
    const { spinner, snackbar } = signUpData.actions;

    spinner(true);
    try {
      const response = await register(signUpData.userData);
      if (response.status === 201) snackbar('Usuario registrado con éxito.', 'success');
    } catch (error) {
      console.log('error registering user:', error);
    } finally {
      spinner(false);
    }
  },
  verifyUser: async (verifyProps) => {
    const { spinner, snackbar } = verifyProps.actions;

    spinner(true);
    try {
      const response = await verifyUser(verifyProps.verifyData);
      if (response.status === 200) snackbar('Usuario verificado con éxito.', 'success');
    } catch (error) {
      console.log('error verifying user:', error);
    } finally {
      spinner(false);
    }
  },
  signin: async (signinProps) => {
    const { spinner, router } = signinProps.actions;

    spinner(true);
    try {
      const response = await login(signinProps.signinData)
      if (response.status === 200) {
        const userData = response.data;
        set({ user: userData.user });
        await SecureStore.setItemAsync('token', userData.token);
        router.replace('/home');
      }
    } catch (error) {
      console.log('error signing in user:', error);
    } finally {
      spinner(false);
    }
  }
}));