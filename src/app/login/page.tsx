"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../register/register.module.css"; // 🔥 USE SAME CSS

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
  const farmerId = localStorage.getItem("farmer_id");

  if (farmerId) {
    router.replace("/dashboard");
  }
}, []);
  

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

      if (!res.ok || !data.farmerId) {
        alert(data.message || "Invalid credentials");
        return;
      }

      // ✅ FIXED KEY
      localStorage.setItem("farmer_id", data.farmerId.toString());

      router.push("/dashboard");

    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>

      {/* LEFT SIDE SAME AS REGISTER */}
      <div className={styles.left}>
        <div className={styles.overlay}>
          <h1 className={styles.heroTitle}>
            Welcome Back to <span>LANDLORDZ</span>
          </h1>
          <p className={styles.heroText}>
            Access your land records, properties and smart agricultural insights.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE LOGIN CARD */}
      <div className={styles.right}>
        <div className={styles.card}>

          <h2 className={styles.heading}>Login to Account</h2>

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

          <p className={styles.bottomText}>
            Don’t have an account?{" "}
            <span onClick={() => router.push("/register")}>
              Register
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}
