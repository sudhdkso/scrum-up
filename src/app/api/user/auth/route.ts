import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import User from "../../../../models/user";
import { v4 as uuidv4 } from "uuid";
import { saveSession } from "@/lib/session";

const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID!;
const KAKAO_REDIRECT_URI = "http://localhost:3000/api/user/auth";
const PROFILE_REQUEST_URI = "https://kapi.kakao.com/v2/user/me";
const TOKEN_REQUEST_URI = "https://kauth.kakao.com/oauth/token";

interface KakaoTokenResponse {
  access_token: string;
  token_type: string;
}

interface KakaoUserResponse {
  id: number;
  kakao_account: {
    email: string;
    profile: {
      nickname: string;
    };
  };
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    if (!code) {
      return NextResponse.json(
        { error: "code 파라미터 필요" },
        { status: 400 }
      );
    }

    const tokenRes = await getToken(code);

    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      return NextResponse.json(
        { success: false, error: tokenData.error },
        { status: 400 }
      );
    }
    const userRes = await getProfile(tokenData);
    const userInfo = await userRes.json();

    const { user, sessionId } = await createKakaoUser(userInfo);

    console.log("사용자 로그인 성공! id=", user.sessionId);
    await saveSession(sessionId, user._id.toString());

    const response = NextResponse.redirect(new URL("/dashboard", req.url));

    response.cookies.set("sessionId", sessionId, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    console.log("session", response.cookies);
    return response;
  } catch (error) {
    console.error("Kakao Auth Error:", error);
    return NextResponse.json({ error: "Kakao 인증 실패" }, { status: 500 });
  }
}

async function getToken(code: string) {
  return await fetch(TOKEN_REQUEST_URI, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: KAKAO_CLIENT_ID!,
      redirect_uri: KAKAO_REDIRECT_URI!,
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
    await dbConnect(); // DB 연결 보장
    const kakaoId = userInfo.id.toString();

    // 이메일이 없으면 오류 처리하거나 가짜 이메일 생성
    let email = userInfo.kakao_account?.email;
    if (!email) {
      // 예: kakaoId 기반 임시 이메일 생성
      email = `temp_${kakaoId}@scrumup.local`;
    }

    let name = userInfo.kakao_account?.profile?.nickname;
    // 닉네임이 없으면 기본값 넣기
    if (!name || name.trim() === "") {
      name = generateRandomNickname();
    }

    let user = await User.findOne({ kakaoId });

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
