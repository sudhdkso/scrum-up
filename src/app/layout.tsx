"use client";
import "./style/globals.css";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/app/components/AuthProvider";
import NavBar from "@/app/components/NavBar";
const EXCLUDE_PATHS = ["/"]; // 원하는 경로들

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (!pathname) {
    return null;
  }

  const exclude = EXCLUDE_PATHS.some((p) => pathname.startsWith(p));
  console.log("pathname", pathname);
  console.log("exclude", exclude);
  // 완전 분기
  if (!exclude) {
    return (
      <html lang="ko">
        <body>
          <div className="layout-container">{children}</div>
        </body>
      </html>
    );
  }

  // 나머지 페이지에서는 NavBar + AuthProvider 모두 적용
  return (
    <html lang="ko">
      <body>
        <AuthProvider>
          <NavBar />
          <div className="layout-container">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
