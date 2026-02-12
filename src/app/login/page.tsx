"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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

      // ✅ SINGLE SOURCE OF TRUTH
      localStorage.setItem("farmerId", String(data.farmerId));

      // ✅ CLEAN NAVIGATION (NO BACK LOOP)
      router.replace("/dashboard");

    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* LEFT */}
      <div style={styles.left}>
        <div style={styles.overlay}>
          <h1 style={styles.title}>
            LAND-LORDZ <br />
            <span style={{ color: "#f9a825" }}>Smart Farming Platform</span>
          </h1>

          <p style={styles.text}>
            Securely manage your land data, verify ownership, and make
            data-driven agricultural decisions.
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div style={styles.right}>
        <div style={styles.card}>
          <h2 style={styles.heading}>Welcome Back</h2>
          <p style={styles.sub}>Login to your farmer account</p>

          <input
            style={styles.input}
            placeholder="Phone or Email"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p style={styles.linkText}>
            New farmer?{" "}
            <span
              style={styles.link}
              onClick={() => router.push("/register")}
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles: any = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
  },

  left: {
    width: "50%",
    background: "url('/farmers.jpg') center/cover no-repeat",
  },

  overlay: {
    height: "100%",
    background: "rgba(0,0,0,0.65)",
    padding: "60px",
    color: "#ffffff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  title: {
    fontSize: "38px",
    fontWeight: "bold",
    marginBottom: "20px",
  },

  text: {
    maxWidth: "420px",
    lineHeight: "1.7",
    color: "#e0e0e0",
  },

  right: {
    width: "50%",
    background: "#f4f7f6",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "380px",
    background: "#ffffff",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.15)",
  },

  heading: {
    fontSize: "24px",
    marginBottom: "8px",
  },

  sub: {
    color: "#666",
    marginBottom: "24px",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "#16a34a",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
  },

  linkText: {
    marginTop: "18px",
    textAlign: "center",
  },

  link: {
    color: "#16a34a",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
