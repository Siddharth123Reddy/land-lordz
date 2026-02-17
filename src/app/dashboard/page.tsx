"use client";

import styles from "./dashboard.module.css";

export default function DashboardPage() {
  return (
    <div className={styles.dashboardWrapper}>
      
      {/* ================= HERO ================= */}
      <div className={styles.dashboardContainer}>
        <h1 className={styles.dashboardTitle}>
          Welcome To <span>LAND-LORDZ</span>
        </h1>

        <p className={styles.dashboardSubtitle}>
          Empowering farmers with smart land insights and 
          data-driven agricultural solutions.
        </p>
      </div>


      {/* ================= CONTACT SECTION ================= */}
      <section className={styles.contactSection}>
        <div className={styles.contactContainer}>

          <div className={styles.contactHeader}>
            <h2 className={styles.contactTitle}>
              Contact <span>Us</span>
            </h2>

            <p className={styles.contactIntro}>
              Have questions about land analysis or crop recommendations?
              Our team is here to support your farming journey.
            </p>
          </div>

          <div className={styles.contactCard}>

            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>📧</div>
              <div>
                <h4>Email</h4>
                <p>support@landlordz.com</p>
              </div>
            </div>

            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>📞</div>
              <div>
                <h4>Phone</h4>
                <p>+91 98765 43210</p>
              </div>
            </div>

          </div>

          <div className={styles.contactHighlight}>
            LAND-LORDZ is committed to empowering farmers with
            reliable, data-driven guidance for smarter and more
            sustainable agricultural decisions.
          </div>

        </div>
      </section>


      {/* ================= FOOTER ================= */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <p className={styles.footerBrand}>© 2026 LAND-LORDZ</p>

          <p className={styles.footerTagline}>
            Smart, Data-Driven Decisions for Profitable Farming
          </p>

          <p className={styles.footerRights}>
            All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
