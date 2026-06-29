import { create } from "zustand";
import { UserState } from "./types/user-store";
import { register, resendUserCode, verifyUser } from "@/api/user.api";
import { changePassword, login, logout, resendPassCode, sendPassCode, verifyPassCode, whoami } from "@/api/auth.api";
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { ApiError } from "@/utils/apiError";

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

        if(onSuccess) onSuccess()
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
        router.replace('/main/lists');
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
        router.replace('/main/lists');
      }
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 401) {
        await SecureStore.deleteItemAsync("sessionToken");
        set({ user: null });
        router.replace("/signin");
      }
      // Otros errores ya muestran feedback vía el interceptor (snackbar).
    }
  },
  logoutSession: async(logoutProps) => {
    const { spinner } = logoutProps;

    spinner(true);

     try {
      const response = await logout();
      if (response.status === 200) {
        await SecureStore.deleteItemAsync('sessionToken');
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
        if(onSuccess) onSuccess()
      }
    } catch (error) {
      console.log('error verifying user:', error);
    } finally {
      spinner(false);
    }
  },
  verifyPassCode: async(verifyProps) => {
    const { spinner, onSuccess, snackbar, t } = verifyProps.actions;

    spinner(true);
    try {
      const response = await verifyPassCode(verifyProps.verifyData);
      if (response.status === 200) {
        snackbar({
          message: t('snackbar.userVerified'), 
          type: 'success'
        });
        if(onSuccess) onSuccess()
      }
    } catch (error) {
      console.log('error verifying user:', error);
    } finally {
      spinner(false);
    }
  },
  changePass: async(changePassData) => {
    const { spinner, onSuccess, snackbar, t } = changePassData.actions;

    spinner(true);
    try {
      const response = await changePassword(changePassData.changePassData);
      if (response.status === 200) {
        snackbar({
          message: t('snackbar.updatedPass'), 
          type: 'success'
        });
        if(onSuccess) onSuccess()
      }
    } catch (error) {
      console.log('error change pass:', error);
    } finally {
      spinner(false);
    }
  },
  resendPassCode: async(resendPassData) => {
    const { spinner, snackbar } = resendPassData.actions;

    spinner(true);

     try {
      const response = await resendPassCode(resendPassData.data);
      if (response.status === 200) {        
        snackbar({
          message: response.data.message, 
          type: 'success'
        });
      }
    } catch (error) {
      console.log('error reesend pass code:', error);
    } finally {
      spinner(false);
    }
  },
}));