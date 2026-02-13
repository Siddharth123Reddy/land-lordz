"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./dashboard.module.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [farmer, setFarmer] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const farmerId = localStorage.getItem("farmerId");
    if (!farmerId) return;

    fetch(`/api/farmer/profile?farmerId=${farmerId}`)
      .then(res => res.json())
      .then(data => setFarmer(data))
      .catch(() => setFarmer(null));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("farmerId");
    router.push("/");
  };

  return (
    <div className={styles.container}>
     <aside className={styles.sidebar}>
  <h2 className={styles.logo}>LAND-LORDZ</h2>

  <ul className={styles.menu}>
    <li onClick={() => router.push("/dashboard")}>
      Dashboard
    </li>

    <li onClick={() => router.push("/dashboard/properties")}>
      Properties
    </li>
  </ul>

  <div className={styles.settingsSection}>
    <p className={styles.settingsTitle}>Settings</p>

    <ul>
      <li onClick={() => router.push("/dashboard/profile")}>
        Profile
      </li>

      <li>
        Inbox
      </li>

      <li>
        Settings
      </li>
    </ul>

    <div className={styles.sidebarFooter}>
      © 2026 LAND-LORDZ
    </div>
  </div>
</aside>

      {/* MAIN AREA */}
      <div className={styles.main}>
        
       {/* TOP BAR */}
<div className={styles.topbar}>
  <div></div>

  {farmer && (
    <div className={styles.profileWrapper}>
      <div
        className={styles.profileCircle}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {farmer.profile_pic ? (
          <img
            src={farmer.profile_pic}
            alt="Profile"
            className={styles.profileCircleImg}
          />
        ) : (
          farmer.name.charAt(0).toUpperCase()
        )}
      </div>

      {showDropdown && (
        <div className={styles.dropdown}>
          {farmer.profile_pic && (
            <img
              src={farmer.profile_pic}
              alt="Profile"
              className={styles.profileLarge}
            />
          )}

          <h3>{farmer.name}</h3>
          <p><strong>Gender:</strong> {farmer.gender || "-"}</p>
          <p><strong>Age:</strong> {farmer.age || "-"}</p>
          <p><strong>District:</strong> {farmer.district || "-"}</p>
          <p><strong>State:</strong> {farmer.state || "-"}</p>

          <hr />

          <button
            className={styles.logoutBtn}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )}
</div>


        {/* PAGE CONTENT */}
        <div className={styles.content}>
          {children}
        </div>

      </div>
    </div>
  );
}
