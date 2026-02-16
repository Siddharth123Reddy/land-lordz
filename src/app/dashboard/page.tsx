"use client";

import styles from "./dashboard.module.css";

export default function DashboardPage() {
  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.dashboardTitle}>
        Welcome To <span>LAND-LORDZ</span>
      </h1>
    </div>
  );
}
