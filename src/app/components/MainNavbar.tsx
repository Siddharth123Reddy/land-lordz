"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function MainNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [farmer, setFarmer] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  /* ================= CHECK LOGIN ================= */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const farmerId = localStorage.getItem("farmerId");

    if (!farmerId) return;

    fetch(`/api/farmer/profile?farmerId=${farmerId}`)
      .then(res => res.json())
      .then(data => setFarmer(data))
      .catch(() => setFarmer(null));
  }, []); // ✅ IMPORTANT: empty dependency array

  const handleLogout = () => {
    localStorage.removeItem("farmerId");
    router.push("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo" onClick={() => router.push("/")}>
          🌾 <span>LAND-LORDZ</span>
        </div>

        <ul className="nav-links">
          <li onClick={() => router.push("/")}>Home</li>
          <li onClick={() => router.push("/")}>About Us</li>
          <li onClick={() => router.push("/")}>Services</li>
          <li onClick={() => router.push("/")}>How It Works</li>
          <li onClick={() => router.push("/")}>Outcomes</li>
          <li onClick={() => router.push("/")}>Contact</li>
        </ul>

        <div className="nav-auth">
          {/* ✅ SHOW PROFILE ONLY ON DASHBOARD */}
          {pathname === "/dashboard" && farmer ? (
            <div className="profile-wrapper">
              <button
                className="profile-btn"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {farmer.name} ▾
              </button>

              {showDropdown && (
                <div className="dropdown-menu profile-card">

                  {/* Profile Image */}
                  {farmer.profile_pic && (
                    <img
                      src={farmer.profile_pic}
                      alt="Profile"
                      className="profile-image"
                    />
                  )}

                  {/* Profile Details */}
                  <div className="profile-details">
                    <p><strong>Name:</strong> {farmer.name}</p>
                    <p><strong>Gender:</strong> {farmer.gender || "-"}</p>
                    <p><strong>Age:</strong> {farmer.age || "-"}</p>
                    <p><strong>Address:</strong> {farmer.address || "-"}</p>
                    <p><strong>District:</strong> {farmer.district || "-"}</p>
                    <p><strong>State:</strong> {farmer.state || "-"}</p>
                  </div>

                  <hr />

                  <button className="logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                className="login-btn"
                onClick={() => router.push("/login")}
              >
                Login
              </button>

              <button
                className="signup-btn"
                onClick={() => router.push("/register")}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
