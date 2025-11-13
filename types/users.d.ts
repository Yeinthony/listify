export interface RegisterUser {
  username?: string;
  email: string;
  password: string;
}

export interface Profile {
  fullname: string;
  biography: string;
  avatarUrl: string | null;
}

export interface User {
  id: string;
  email: string;
  username: string;
  isVerifyed: boolean;
  profile: Profile | null
}