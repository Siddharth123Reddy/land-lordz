"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

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
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("farmerId");
    router.push("/");
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">

          {/* LOGO */}
          <div className="nav-logo" onClick={() => router.push("/")}>
            <Image
              src="/logoL.png"
              alt="LandLordz Logo"
              width={40}
              height={40}
              priority
            />
            <span>LANDLORDZ</span>
          </div>

          {/* NAV LINKS */}
          <ul className="nav-links">
            <li onClick={() => router.push("/")}>Home</li>
            <li onClick={() => router.push("/")}>About Us</li>
            <li onClick={() => router.push("/")}>Services</li>
            <li onClick={() => router.push("/")}>How It Works</li>
            <li onClick={() => router.push("/")}>Outcomes</li>
            <li onClick={() => router.push("/")}>Contact</li>
          </ul>

          {/* AUTH SECTION */}
          <div className="nav-auth">
            {pathname === "/dashboard" && farmer ? (
              <div className="profile-wrapper">
                <button
                  className="profile-btn"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  {farmer.name} ▾
                </button>

                {showDropdown && (
                  <div className="dropdown-menu">
                    <div className="profile-details">
                      <p><strong>Name:</strong> {farmer.name}</p>
                      <p><strong>District:</strong> {farmer.district || "-"}</p>
                      <p><strong>State:</strong> {farmer.state || "-"}</p>
                    </div>

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

      {/* STYLES */}
      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          width: 100%;
          height: 80px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid #f3e8ff;
          display: flex;
          align-items: center;
          z-index: 1000;
          font-family: "Inter", sans-serif;
        }

        .nav-container {
          width: 100%;
          padding: 0 60px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        .nav-logo span {
          font-size: 20px;
          font-weight: 700;
          background: linear-gradient(90deg, #7c3aed, #f59e0b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .nav-links {
          display: flex;
          gap: 30px;
          list-style: none;
        }

        .nav-links li {
          cursor: pointer;
          font-weight: 500;
          color: #4b5563;
          position: relative;
          transition: 0.3s ease;
        }

        .nav-links li::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -6px;
          width: 0%;
          height: 2px;
          background: linear-gradient(90deg, #7c3aed, #f59e0b);
          transition: 0.3s ease;
        }

        .nav-links li:hover::after {
          width: 100%;
        }

        .nav-auth {
          display: flex;
          gap: 15px;
        }

        .login-btn {
          padding: 8px 22px;
          border-radius: 16px;
          border: 2px solid #7c3aed;
          background: transparent;
          color: #7c3aed;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s ease;
        }

        .login-btn:hover {
          background: #7c3aed;
          color: white;
        }

        .signup-btn {
          padding: 8px 22px;
          border-radius: 16px;
          background: linear-gradient(90deg, #7c3aed, #f59e0b);
          color: white;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: 0.3s ease;
        }

        .signup-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(245, 158, 11, 0.4);
        }

        .profile-wrapper {
          position: relative;
        }

        .profile-btn {
          padding: 8px 18px;
          border-radius: 16px;
          background: linear-gradient(90deg, #7c3aed, #f59e0b);
          border: none;
          color: white;
          cursor: pointer;
          font-weight: 600;
        }

        .dropdown-menu {
          position: absolute;
          right: 0;
          top: 45px;
          background: white;
          padding: 20px;
          border-radius: 16px;
          box-shadow: 0 15px 40px rgba(124, 58, 237, 0.25);
          width: 220px;
        }

        .logout-btn {
          margin-top: 10px;
          width: 100%;
          padding: 8px;
          border-radius: 12px;
          border: none;
          background: #ef4444;
          color: white;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
