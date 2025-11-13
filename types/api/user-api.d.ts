import { User } from "../users";

export interface RegisterResponse {
  user: User;
  token: string;
}