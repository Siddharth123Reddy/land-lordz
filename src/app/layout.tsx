import "./globals.css";
import MainNavbar from "./components/MainNavbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>LAND-LORDZ | Farmer Land Verification</title>
      </head>
      <body style={{ margin: 0 }}>
        <MainNavbar />
        {children}
      </body>
    </html>
  );
}
