import { create } from "zustand";
import { UserState } from "./types/user-store";
import { register, resendUserCode, verifyUser } from "@/api/user.api";
import { login, logout, sendPassCode, whoami } from "@/api/auth.api";
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import axios, { AxiosError } from "axios";

export const useUserStore = create<UserState>((set) => ({
  user: null,
  signUp: async(signUpData) => {
    const { spinner, onSuccess, snackbar, t } = signUpData.actions;

    spinner(true);
    try {
      const response = await register(signUpData.userData);
      if (response.status === 201) {
        console.log('Usuario registrado con éxito');
        
        snackbar({
          message: t('snackbar.userRegistered'), 
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
  resendUserCode: async(resendData) => {
    const { spinner, snackbar } = resendData.actions;

    spinner(true);

     try {
      const response = await resendUserCode(resendData.data);
      if (response.status === 200) {        
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
  verifyUser: async(verifyProps) => {
    const { spinner, snackbar, t } = verifyProps.actions;

    spinner(true);
    try {
      const response = await verifyUser(verifyProps.verifyData);
      if (response.status === 200) {
        snackbar({
          message: t('snackbar.userVerified'), 
          type: 'success'
        });
        return true
      }

      return false
    } catch (error) {
      console.log('error verifying user:', error);
      return false
    } finally {
      if(!verifyProps.noCloseSpinner) spinner(false);
    }
  },
  signin: async(signinProps) => {
    const { spinner } = signinProps;

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
  },
  reloadSession: async() => {
    try {
      const response = await whoami()
      if (response.status === 200) {
        const userData = response.data;
        set({ user: userData.user });
        await SecureStore.setItemAsync('sessionToken', userData.token);
        router.replace('/main');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          await SecureStore.deleteItemAsync("sessionToken");
          set({ user: null });
          router.replace("/signin");
          return;
        }

        console.log("Axios error:", error.response);
      } else {
        console.log("Unknown error:", error);
      }
    }
  },
  logoutSession: async(logoutProps) => {
    const { spinner } = logoutProps;

    spinner(true);

     try {
      const response = await logout();
      if (response.status === 200) {
        await SecureStore.setItemAsync('sessionToken', '');
        set({user: null})
        router.replace('/signin');
      }
    } catch (error) {
      console.log('error registering user:', error);
    } finally {
      spinner(false);
    }
  },
  sendCodeChangePass: async(sendPassCodeProps) => {
    const { spinner, onSuccess, snackbar, t } = sendPassCodeProps.actions;

    spinner(true);
    try {
      const response = await sendPassCode(sendPassCodeProps.data);
      if (response.status === 200) {
        snackbar({
          message: t('snackbar.verifyCodeSend'), 
          type: 'success'
        });
        onSuccess()
      }
    } catch (error) {
      console.log('error verifying user:', error);
    } finally {
      spinner(false);
    }
  }
}));