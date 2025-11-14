import { User } from "../users";

export interface SigninResponse {
  user: User;
  token: string;
}

export interface SigninProps {
  email: string;
  password: string;
}