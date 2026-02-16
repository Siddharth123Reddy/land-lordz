"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "./dashboard.module.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <>
      <nav className={styles.navbar}>
        {/* 🔲 BLACK AREA - Logo + Name */}
        <div className={styles.logoSection}>
          <Image src="/logoL.png" alt="Logo" width={45} height={45} />
          <span className={styles.brandName}>LAND-LORDZ</span>
        </div>

        {/* 🟨 YELLOW AREA - Links */}
        <div className={styles.navLinks}>
          <Link
            href="/dashboard"
            className={pathname === "/dashboard" ? styles.active : ""}
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/properties"
            className={
              pathname === "/dashboard/properties" ? styles.active : ""
            }
          >
            Properties
          </Link>
          <Link
            href="/dashboard/profile"
            className={
              pathname === "/dashboard/profile" ? styles.active : ""
            }
          >
            Profile
          </Link>
        </div>

        {/* 🟩 GREEN AREA - Profile Pic + Logout */}
        <div className={styles.profileWrapper}>
          {user && (
            <>
              <Image
                src={`data:image/png;base64,${user.profile_image_base64}`}
                alt="Profile"
                width={42}
                height={42}
                className={styles.profilePic}
                onClick={() => setOpen(!open)}
              />

              {open && (
                <div className={styles.dropdown}>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </>
          )}
        </div>
      </nav>

      <main className={styles.mainContent}>{children}</main>
    </>
  );
}
