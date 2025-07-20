import "./style/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <div className="layout-container">{children}</div>
      </body>
    </html>
  );
}
