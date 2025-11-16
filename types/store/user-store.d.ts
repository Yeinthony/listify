import { useRouter } from "expo-router";
import { ActionDeps } from "../action-deps";
import { RegisterUser, User, VerifyUser } from "../users";
import { useSpinnerModal } from "@/contexts/SpinnerModalContext";


interface SignUpActions extends ActionDeps {
  onSuccess: () => void;
}

interface SigninActionDeps {
  
}
export interface VerifyUserProps {
  verifyData: VerifyUser;
  actions: ActionDeps;
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

export interface UserState {
  user: User | null;
  signUp: (userData: SignUpProps) => Promise<void>;
  verifyUser: (verifyData: VerifyUserProps) => Promise<boolean>;
  signin: (signinData: SignInProps) => Promise<void>;
  resendUserCode: (resendData: ResendUserCodeProps) => Promise<void>;
  reloadSession: () => Promise<void>;
}