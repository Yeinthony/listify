import { User } from "../users";

export interface SigninResponse {
  token: string;
  expiresAt: string;
  user: User;
}

export interface SigninProps {
  email: string;
  password: string;
}
