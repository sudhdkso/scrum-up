"use client";
import "@/style/globals.css";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/components/AuthProvider";
import Footer from "../components/Footer";
import NavBar from "@/components/NavBar";
const EXCLUDE_PATHS = ["/", "/invite/", "/login"];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (!pathname) {
    return null;
  }

  const exclude = EXCLUDE_PATHS.some((p) =>
    p === "/" ? pathname === "/" : pathname.startsWith(p)
  );
  if (exclude) {
    return (
      <html lang="ko">
        <body>
          <div className="layout-container">{children}</div>
          <Footer />
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
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
