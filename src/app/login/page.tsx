"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();

  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const c = contact.trim();
    const p = password.trim();

    if (!c || !p) {
      alert("Enter contact and password");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact: c, password: p }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Invalid credentials");
        return;
      }

      if (!data.farmerId) {
        alert("Login failed: farmerId missing");
        return;
      }

      // ✅ Save farmerId
      localStorage.setItem("farmerId", String(data.farmerId));

      // ✅ Clean navigation (no back loop)
      router.replace("/dashboard");

    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      
      {/* LEFT SIDE */}
      <div className={styles.left}>
        <div className={styles.overlay}>
          <h1 className={styles.heroTitle}>
            Smart Farming <br />
            <span>Starts Here</span>
          </h1>

          <p className={styles.heroText}>
            Manage land records, verify ownership, and unlock
            intelligent agricultural insights with LAND-LORDZ.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className={styles.right}>
        <div className={styles.card}>
          
        

          <h2 className={styles.heading}>Welcome Back</h2>
          <p className={styles.sub}>Login </p>

          <input
            className={styles.input}
            placeholder="Phone or Email"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />

          <input
            className={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className={styles.button}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className={styles.linkText}>
            New to Land LordZ?{" "}
            <span onClick={() => router.push("/register")}>
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
