"use client";

import { useRouter } from "next/navigation";
import { useState, CSSProperties } from "react";

export default function RegisterPage() {
  const router = useRouter();

  /* ---------------- STATE ---------------- */

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");

  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [stateName, setStateName] = useState("");

  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  /* ---------------- STEP 1 : CHECK CONTACT ---------------- */

  const handleCheckContact = async () => {
    if (!contact.trim()) {
      alert("Contact is required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/check-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact: contact.trim() }),
      });

      const data = await res.json();

      if (data.exists) {
        router.push("/login");
      } else {
        setStep(2);
      }
    } catch {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- REGISTER + IMAGE + AUTO LOGIN ---------------- */

  const handleRegister = async () => {
    if (!name.trim() || !contact.trim() || !password.trim()) {
      alert("Name, Contact and Password are required");
      return;
    }

    setLoading(true);

    try {
      // 🔹 Register user first
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          contact: contact.trim(),
          password: password.trim(),
          age: age || null,
          gender: gender || null,
          address: address || null,
          district: district || null,
          state: stateName || null,
          profile_pic: null,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.farmerId) {
        alert(data.message || "Registration failed");
        return;
      }

      const farmerId = data.farmerId;

      // 🔹 Upload profile pic if selected
      if (profilePic) {
        const formData = new FormData();
        formData.append("file", profilePic);
        formData.append("farmerId", farmerId);

        const uploadRes = await fetch("/api/upload-profile-pic", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          alert("Profile picture upload failed");
          return;
        }
      }

      // 🔹 Auto login
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact: contact.trim(),
          password: password.trim(),
        }),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok || !loginData.farmerId) {
        alert("Auto login failed");
        return;
      }

      localStorage.clear();
      localStorage.setItem("farmerId", loginData.farmerId);

      router.push("/dashboard");
    } catch {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FILE PREVIEW ---------------- */

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProfilePic(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div style={styles.container}>
      {/* LEFT */}
      <div style={styles.left}>
        <div style={styles.overlay}>
          <h1 style={styles.brand}>LAND-LORDZ</h1>
          <p style={styles.tagline}>
            Smart Agricultural Registration & Digital Land Verification 🌾
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div style={styles.right}>
        <div style={styles.card}>
          {step === 1 && (
            <>
              <h2 style={styles.heading}>Create Account</h2>

              <input
                style={styles.input}
                placeholder="Phone or Email"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />

              <button
                style={styles.primaryBtn}
                onClick={handleCheckContact}
                disabled={loading}
              >
                {loading ? "Checking..." : "Continue"}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 style={styles.heading}>Complete Registration</h2>

              <input
                style={styles.input}
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                style={styles.input}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <select
                style={styles.input}
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select Gender (Optional)</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>

              <input
                style={styles.input}
                type="number"
                placeholder="Age (Optional)"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />

              <textarea
                style={{ ...styles.input, height: "80px" }}
                placeholder="Address (Optional)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <input
                style={styles.input}
                placeholder="District (Optional)"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              />

              <input
                style={styles.input}
                placeholder="State (Optional)"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
              />

              {preview && (
                <div style={{ textAlign: "center", marginBottom: 10 }}>
                  <img
                    src={preview}
                    width={100}
                    height={100}
                    style={{ borderRadius: "50%", objectFit: "cover" }}
                  />
                </div>
              )}

              <input type="file" accept="image/*" onChange={handleFileChange} />

              <button
                style={styles.primaryBtn}
                onClick={handleRegister}
                disabled={loading}
              >
                {loading
                  ? "Creating Account..."
                  : "Register & Go to Dashboard"}
              </button>
            </>
          )}

          <p style={styles.bottomText}>
            Already have an account?{" "}
            <span style={styles.link} onClick={() => router.push("/login")}>
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles: Record<string, CSSProperties> = {
  container: { display: "flex", minHeight: "100vh", fontFamily: "Arial" },
  left: {
    width: "50%",
    background: "url('/farming.jpg') center/cover no-repeat",
  },
  overlay: {
    height: "100%",
    background: "rgba(0,0,0,0.7)",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "60px",
  },
  brand: { fontSize: "40px", fontWeight: "bold", marginBottom: "20px" },
  tagline: { maxWidth: "400px", lineHeight: 1.6 },
  right: {
    width: "50%",
    background: "#f0fdf4",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "420px",
    background: "#fff",
    padding: "40px",
    borderRadius: "18px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
  },
  heading: { marginBottom: "20px" },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  primaryBtn: {
    width: "100%",
    padding: "12px",
    background: "#16a34a",
    color: "#fff",
    borderRadius: "8px",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
  },
  bottomText: { marginTop: "20px", textAlign: "center" },
  link: { color: "#16a34a", fontWeight: "bold", cursor: "pointer" },
};
