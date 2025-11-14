import { create } from "zustand";
import { UserState } from "@/types/store/user-store";
import { register, resendUserCode, verifyUser } from "@/api/user.api";
import { login } from "@/api/auth.api";
import * as SecureStore from 'expo-secure-store';

export const useUserStore = create<UserState>((set) => ({
  user: null,
  signUp: async (signUpData) => {
    const { spinner, onSuccess, snackbar } = signUpData.actions;

    spinner(true);
    try {
      const response = await register(signUpData.userData);
      if (response.status === 201) {
        console.log('Usuario registrado con éxito');
        
        snackbar({
          message: 'Usuario registrado con éxito.', 
          type: 'success'
        });

        onSuccess()
      }
    } catch (error) {
      console.log('error registering user:', error);
    } finally {
      spinner(false);
    }
  },
  resendUserCode: async (resendData) => {
    const { spinner, snackbar } = resendData.actions;

    spinner(true);

     try {
      const response = await resendUserCode(resendData.data);
      if (response.status === 200) {
        console.log('Codigo reenviado');
        
        snackbar({
          message: response.data.message, 
          type: 'success'
        });
      }
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
      if (response.status === 200) {
        snackbar({
          message: 'Usuario verificado con éxito.', 
          type: 'success'
        });
        return true
      }

      return false
    } catch (error) {
      console.log('error verifying user:', error);
      return false
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
        await SecureStore.setItemAsync('sessionToken', userData.token);
        router.replace('/main');
      }
    } catch (error) {
      console.log('error signing in user:', error);
    } finally {
      spinner(false);
    }
  }
}));