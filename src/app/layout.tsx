"use client";

import "./globals.css";
import MainNavbar from "./components/MainNavbar";
import { usePathname } from "next/navigation";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <html lang="en">
      <head>
        <title>LAND-LORDZ | Farmer Land Verification</title>
      </head>
      <body style={{ margin: 0 }}>
        {!isDashboard && <MainNavbar />}
        {children}
      </body>
    </html>
  );
}
