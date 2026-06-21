export interface VerifyCode {
  email: string;
  code: string;
}

export interface RegisterUser {
  username?: string;
  email: string;
  password: string;
}

export type ExchangeType = 'blue' | 'oficial' | 'mep' | 'ccl';

export interface Profile {
  fullName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  phone?: string | null;
  country?: string | null;
  preferredExchangeRate?: ExchangeType;
}

export interface User {
  id: string;
  email: string;
  username: string;
  isVerified: boolean;
  profile: Profile | null;
}
