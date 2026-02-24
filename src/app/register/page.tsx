"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./register.module.css";

export default function RegisterPage() {
  const router = useRouter();

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
  const [pincode, setPincode] = useState(""); // ✅ NEW

  const [preview, setPreview] = useState("");

   useEffect(() => {
    const farmerId = localStorage.getItem("farmer_id");

    if (farmerId) {
      router.replace("/dashboard");
    }
  }, []);

  /* ================= STEP 1 ================= */

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
    } catch (error) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILE TO BASE64 ================= */

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  /* ================= REGISTER ================= */

  const handleRegister = async () => {
    if (!name.trim() || !contact.trim() || !password.trim()) {
      alert("Name, Contact and Password are required");
      return;
    }

    setLoading(true);

    try {
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
          pincode: pincode || null, // ✅ ADDED
          profile_pic: preview || null,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.farmerId) {
        alert(data.message || "Registration failed");
        return;
      }

      localStorage.setItem("farmer_id", data.farmerId.toString());

      router.push("/dashboard");

    } catch (error) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className={styles.container}>
      
      <div className={styles.left}>
        <div className={styles.overlay}>
          <h1 className={styles.heroTitle}>
            Join LANDLORDZ <span>Today</span>
          </h1>
          <p className={styles.heroText}>
            Register your land digitally and unlock smart agricultural insights.
          </p>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.card}>

          {step === 1 && (
            <>
              <h2 className={styles.heading}>Register Account</h2>

              <input
                className={styles.input}
                placeholder="Phone or Email"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />

              <button
                className={styles.button}
                onClick={handleCheckContact}
                disabled={loading}
              >
                {loading ? "Checking..." : "Continue"}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className={styles.heading}>Complete Registration</h2>

              <input
                className={styles.input}
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                className={styles.input}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <select
                className={styles.input}
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select Gender (Optional)</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>

              <input
                className={styles.input}
                type="number"
                placeholder="Age (Optional)"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />

              <input
                className={styles.input}
                placeholder="Address (Optional)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <input
                className={styles.input}
                placeholder="District (Optional)"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              />

              <input
                className={styles.input}
                placeholder="State (Optional)"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
              />

              {/* ✅ PINCODE FIELD ADDED */}
              <input
                className={styles.input}
                type="number"
                placeholder="Pincode (Optional)"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />

              {preview && (
                <div className={styles.preview}>
                  <img src={preview} alt="Profile Preview" />
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />

              <button
                className={styles.button}
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? "Registering..." : "Register & Go to Dashboard"}
              </button>
            </>
          )}

          <p className={styles.bottomText}>
            Already have an account?{" "}
            <span onClick={() => router.push("/login")}>
              Login
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}
