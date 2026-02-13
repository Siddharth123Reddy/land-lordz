"use client";

import { useEffect, useState } from "react";
import styles from "../dashboard.module.css";

export default function ProfilePage() {
  const [farmer, setFarmer] = useState<any>(null);

  useEffect(() => {
    const farmerId = localStorage.getItem("farmerId");
    if (!farmerId) return;

    fetch(`/api/farmer/profile?farmerId=${farmerId}`)
      .then(res => res.json())
      .then(data => setFarmer(data))
      .catch(() => setFarmer(null));
  }, []);

  if (!farmer) return <p>Loading...</p>;

  return (
    <div className={styles.profileCard}>
      {farmer.profile_pic && (
        <img
          src={farmer.profile_pic}
          alt="Profile"
          className={styles.profileBigImage}
        />
      )}

      <h2>{farmer.name}</h2>

      <div className={styles.profileDetails}>
        <p><strong>Gender:</strong> {farmer.gender || "-"}</p>
        <p><strong>Age:</strong> {farmer.age || "-"}</p>
        <p><strong>Address:</strong> {farmer.address || "-"}</p>
        <p><strong>District:</strong> {farmer.district || "-"}</p>
        <p><strong>State:</strong> {farmer.state || "-"}</p>
        <p><strong>Contact:</strong> {farmer.contact}</p>
      </div>
    </div>
  );
}
