import { ActionDeps } from "../action-deps";
import { RegisterUser, User } from "../users";

export interface SignUpProps {
  userData: RegisterUser;
  actions: ActionDeps
}

export interface UserState {
  user: User | null;
  signUp: (userData: SignUpProps) => Promise<void>;
}