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
    const farmerId = localStorage.getItem("farmer_id");

    if (!farmerId || farmerId === "undefined") return;

    fetch(`/api/farmer/profile?farmerId=${farmerId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("farmer_id");
    window.location.href = "/";
  };

  return (
    <>
      <nav className={styles.navbar}>
        {/* LEFT - Logo */}
        <div className={styles.logoSection}>
          <Image src="/logoL.png" alt="Logo" width={45} height={45} />
          <span className={styles.brandName}>LAND-LORDZ</span>
        </div>

        {/* CENTER - Links */}
        <div className={styles.navLinks}>
          <Link
            href="/dashboard"
            className={
              pathname === "/dashboard"
                ? styles.active
                : ""
            }
          >
            Dashboard
          </Link>

          <Link
            href="/dashboard/properties"
            className={
              pathname.startsWith("/dashboard/properties")
                ? styles.active
                : ""
            }
          >
            Properties
          </Link>

          <Link
            href="/dashboard/profile"
            className={
              pathname === "/dashboard/profile"
                ? styles.active
                : ""
            }
          >
            Profile
          </Link>
        </div>

        {/* RIGHT - Profile */}
        <div className={styles.profileWrapper}>
          {user && user.profile_pic && (
            <>
              <img
                src={user.profile_pic}
                alt="Profile"
                className={styles.profilePic}
                onClick={() => setOpen(!open)}
              />

              {open && (
                <div className={styles.dropdown}>
                  <button onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </nav>

      <main className={styles.mainContent}>
        {children}
      </main>
    </>
  );
}
