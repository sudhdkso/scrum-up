import dbConnect from "@/lib/mongodb";
import User, { IUser } from "@/models/user";
import { v4 as uuidv4 } from "uuid";
import {
  KakaoTokenResponse,
  KakaoUserResponse,
  LoginResult,
} from "./dto/auth.dto";

const KAKAO_CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID!;
const INVITE_REDIRECT_URI = process.env.NEXT_PUBLIC_INVITE_REDIRECT_URI!;
const KAKAO_REDIRECT_URI = process.env.REDIRECT_URI!;
const PROFILE_REQUEST_URI = "https://kapi.kakao.com/v2/user/me";
const TOKEN_REQUEST_URI = "https://kauth.kakao.com/oauth/token";

export async function login(
  code: string,
  isInvite: boolean = false
): Promise<LoginResult> {
  const tokenRes = await getToken(code, isInvite);

  const tokenData = await tokenRes.json();

  if (tokenData.error) {
    return { user: null, sessionId: "", error: tokenData.error };
  }
  const userRes = await getProfile(tokenData);
  const userInfo = await userRes.json();

  return await createKakaoUser(userInfo);
}

async function getToken(code: string, isInvite: boolean) {
  return await fetch(TOKEN_REQUEST_URI, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: KAKAO_CLIENT_ID!,
      redirect_uri: isInvite ? INVITE_REDIRECT_URI : KAKAO_REDIRECT_URI,
      code,
    }).toString(),
  });
}

async function getProfile(tokenData: KakaoTokenResponse) {
  return await fetch(PROFILE_REQUEST_URI, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });
}

async function createKakaoUser(userInfo: KakaoUserResponse) {
  try {
    await dbConnect();
    const kakaoId = userInfo.id.toString();

    let email = userInfo.kakao_account?.email;
    if (!email) {
      email = `temp_${kakaoId}@scrumup.local`;
    }

    let name = userInfo.kakao_account?.profile?.nickname;
    // 닉네임이 없으면 기본값 넣기
    if (!name || name.trim() === "") {
      name = generateRandomNickname();
    }

    let user = await User.findOne({ kakaoId }).lean<IUser>();

    if (!user) {
      user = await User.create({
        kakaoId,
        email,
        name,
      });
    }

    const sessionId = uuidv4();
    return { user, sessionId };
  } catch (error) {
    console.error("Failed to create user", error);
    throw new Error("사용자 생성 실패");
  }
}

function generateRandomNickname() {
  const adjectives = ["멋진", "귀여운", "행복한", "용감한", "똑똑한"];
  const animals = ["토끼", "호랑이", "여우", "사자", "부엉이"];
  const randAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randAnimal = animals[Math.floor(Math.random() * animals.length)];
  const randNum = Math.floor(Math.random() * 1000);

  return `${randAdj}${randAnimal}${randNum}`;
}
