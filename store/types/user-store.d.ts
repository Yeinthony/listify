import { useRouter } from "expo-router";
import { ActionDeps, ActionDepsT } from "@/types/action-deps"; 
import { RegisterUser, User, VerifyCode } from "@/types/users";
import { useSpinnerModal } from "@/contexts/SpinnerModalContext";
import { TFunction } from "i18next";


interface SignUpActions extends ActionDepsT {
  onSuccess?: () => void;
}

export interface VerifyUserProps {
  verifyData: VerifyCode;
  actions: ActionDepsT;
  noCloseSpinner?: boolean
}
export interface SignUpProps {
  userData: RegisterUser;
  actions: SignUpActions
}

export interface SignInProps {
  signinData: {
    email: string;
    password: string;
  }
  spinner: ReturnType<typeof useSpinnerModal>;
}

export interface ResendUserCodeProps {
  data: {
    email: string;
  }
  actions: ActionDeps;
}

export interface LogoutProps {
  spinner: ReturnType<typeof useSpinnerModal>;
}

export interface SendPassCodeProps {
  data: {
    email: string;
  }
  actions: SignUpActions;
}

export interface VerifyPassCodeProps {
  verifyData: VerifyCode;
  actions: SignUpActions;
}

export interface ChangePassProps {
  changePassData: {
    email: string;
    password: string;
  };
  actions: SignUpActions;
}

export interface UserState {
  user: User | null;
  signUp: (userData: SignUpProps) => Promise<void>;
  verifyUser: (verifyData: VerifyUserProps) => Promise<boolean>;
  signin: (signinData: SignInProps) => Promise<void>;
  resendUserCode: (resendData: ResendUserCodeProps) => Promise<void>;
  reloadSession: () => Promise<void>;
  logoutSession: (logoutProps: LogoutProps) => Promise<void>;
  sendCodeChangePass: (sendPassCodeProps: SendPassCodeProps) => Promise<void>;
  verifyPassCode: (verifyData: VerifyPassCodeProps) => Promise<void>;
  changePass: (changePassData: ChangePassProps) => Promise<void>;
  resendPassCode: (resendPassData: ResendUserCodeProps) => Promise<void>;
}