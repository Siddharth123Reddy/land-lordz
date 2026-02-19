import "./globals.css";
import MainNavbar from "./components/MainNavbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ margin: 0 }}>
        <MainNavbar />
        {children}
      </body>
    </html>
  );
}

