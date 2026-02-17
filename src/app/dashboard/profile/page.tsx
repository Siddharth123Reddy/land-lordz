"use client";

import { useEffect, useState } from "react";
import styles from "../dashboard.module.css";

export default function ProfilePage() {
  const [form, setForm] = useState<any>(null);
  const [original, setOriginal] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const farmerId = localStorage.getItem("farmer_id");
    if (!farmerId) return;

    fetch(`/api/farmer/profile?farmerId=${farmerId}`)
      .then((res) => res.json())
      .then((data) => {
        setForm(data);
        setOriginal(data);
      });
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      await fetch("/api/farmer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmerId: form.farmer_id,
          gender: form.gender,
          age: form.age,
          address: form.address,
          district: form.district,
        }),
      });

      if (imageFile) {
        const formData = new FormData();
        formData.append("farmerId", form.farmer_id);
        formData.append("file", imageFile);

        await fetch("/api/upload-profile-pic", {
          method: "POST",
          body: formData,
        });
      }

      setEditing(false);
      setOriginal(form);
      window.location.reload();

    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm(original);
    setEditing(false);
  };

  if (!form) return <p>Loading...</p>;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>

        {/* HEADER */}
        <div className={styles.profileHeader}>
          <h2 className={styles.profileTitle}>My Profile</h2>
          <p className={styles.profileSubtitle}>
            Manage your personal details and information
          </p>
        </div>

        {/* PROFILE IMAGE */}
        <div className={styles.profileImageSection}>
          {form.profile_pic && (
            <img
              src={form.profile_pic}
              alt="Profile"
              className={styles.profileImage}
            />
          )}

          {editing && (
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImageFile(e.target.files?.[0] || null)
              }
            />
          )}
        </div>

        {/* FORM GRID */}
        <div className={styles.profileGrid}>
          <div>
            <label>Name</label>
            <input value={form.name} disabled />
          </div>

          <div>
            <label>Phone</label>
            <input value={form.contact} disabled />
          </div>

          <div>
            <label>Gender</label>
            <input
              name="gender"
              value={form.gender || ""}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>

          <div>
            <label>Age</label>
            <input
              name="age"
              value={form.age || ""}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>

          <div className={styles.fullWidth}>
            <label>Address</label>
            <input
              name="address"
              value={form.address || ""}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>

          <div>
            <label>District</label>
            <input
              name="district"
              value={form.district || ""}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>
        </div>

        {/* BUTTONS */}
        <div className={styles.buttonSection}>
          {!editing ? (
            <button
              className={styles.primaryBtn}
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                className={styles.primaryBtn}
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>

              <button
                className={styles.secondaryBtn}
                onClick={handleCancel}
              >
                Cancel
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
