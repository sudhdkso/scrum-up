import { IUser } from "@/models/user";

export interface KakaoTokenResponse {
  access_token: string;
  token_type: string;
}

export interface KakaoUserResponse {
  id: number;
  kakao_account: {
    email: string;
    profile: {
      nickname: string;
    };
  };
}

export interface LoginResult {
  user: IUser | null;
  sessionId: string;
  error?: string;
}
