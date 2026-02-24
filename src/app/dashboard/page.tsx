"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./dashboard.module.css";
import {
  Shield,
  Lock,
  Fingerprint,
  Camera,
  UserCheck,
  Key,
  Radio,
  Flame,
  FileText,
  Leaf,
  Droplets,
  Sun,
  Recycle,
  Zap,
  Tractor,
  Wind,
  Trees,
  Users,
  Handshake,
  Calendar,
  Heart,
  Network,
  Smile,
  LifeBuoy,
} from "lucide-react";

const Feature = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <div className={styles.featureCard}>
    <div className={styles.featureIcon}>{icon}</div>
    <p>{title}</p>
  </div>
);

type Property = {
  property_id: number;
  property_name: string;
  property_type: string;
  location: string;
  property_image: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const farmerId = localStorage.getItem("farmer_id");

    if (!farmerId) {
      router.push("/login");
      return;
    }

    const fetchProperties = async () => {
      try {
        const res = await fetch(
          `/api/properties/list?farmer_id=${farmerId}`
        );

        const data = await res.json();

        // ✅ FIXED RESPONSE HANDLING
        if (data.success && Array.isArray(data.properties)) {
          setProperties(data.properties);
        } else {
          setProperties([]);
        }

      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [router]);

  return (
    <div className={styles.dashboardWrapper}>

      {/* HERO */}
      <div className={styles.dashboardContainer}>
        <h1 className={styles.dashboardTitle}>
          Welcome To <span>LANDLORDZ</span>
        </h1>

        <p className={styles.dashboardSubtitle}>
          Manage your lands and view property insights easily.
        </p>
      </div>

      {/* MY PROPERTIES */}
      <section className={styles.myPropertiesSection}>
        <h2 className={styles.sectionTitle}>My Properties</h2>

        {loading ? (
          <p className={styles.simpleText}>Loading properties...</p>
        ) : properties.length === 0 ? (
          <p className={styles.simpleText}>
            No properties added yet.
          </p>
        ) : (
          <div className={styles.propertyGrid}>
            {properties.map((property) => (
              <div
                key={property.property_id}
                className={styles.propertyCard}
                onClick={() =>
                  router.push(
                    `/dashboard/properties/${property.property_id}`
                  )
                }
              >
                {property.property_image ? (
                  <img
                    src={property.property_image}
                    alt={property.property_name}
                  />
                ) : (
                  <div className={styles.noImage}>
                    No Image
                  </div>
                )}

                <div className={styles.cardContent}>
                  <h3>{property.property_name}</h3>
                  <p className={styles.typeText}>
                    {property.property_type}
                  </p>
                  <span className={styles.locationText}>
                    📍 {property.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FEATURES SECTION */}
      <div className={styles.featureSection}>

        {/* SECURITY */}
        <div className={styles.featureCategory}>
          <h2 className={styles.featureTitle}>SECURITY</h2>
          <div className={styles.featureGrid}>
            <Feature icon={<Shield />} title="Security" />
            <Feature icon={<Lock />} title="Lock" />
            <Feature icon={<Shield />} title="Shield" />
            <Feature icon={<Fingerprint />} title="Fingerprint" />
            <Feature icon={<Camera />} title="Surveillance" />
            <Feature icon={<UserCheck />} title="User Verified" />
            <Feature icon={<Key />} title="Access Control" />
            <Feature icon={<Radio />} title="Motion Sensor" />
            <Feature icon={<Flame />} title="Fire Safety" />
            <Feature icon={<FileText />} title="Policies" />
          </div>
        </div>

        {/* SUSTAINABILITY */}
        <div className={styles.featureCategory}>
          <h2 className={styles.featureTitle}>SUSTAINABILITY</h2>
          <div className={styles.featureGrid}>
            <Feature icon={<Leaf />} title="Eco-friendly" />
            <Feature icon={<Droplets />} title="Water Conservation" />
            <Feature icon={<Sun />} title="Solar Energy" />
            <Feature icon={<Recycle />} title="Recycling" />
            <Feature icon={<Zap />} title="Energy Efficiency" />
            <Feature icon={<Tractor />} title="Organic Farming" />
            <Feature icon={<Wind />} title="Wind Energy" />
            <Feature icon={<Trees />} title="Afforestation" />
          </div>
        </div>

        {/* SOCIABILITY */}
        <div className={styles.featureCategory}>
          <h2 className={styles.featureTitle}>SOCIABILITY</h2>
          <div className={styles.featureGrid}>
            <Feature icon={<Users />} title="Community" />
            <Feature icon={<Network />} title="Networking" />
            <Feature icon={<Calendar />} title="Events" />
            <Feature icon={<Heart />} title="Volunteering" />
            <Feature icon={<Handshake />} title="Connections" />
            <Feature icon={<Smile />} title="Inclusion" />
            <Feature icon={<LifeBuoy />} title="Support Groups" />
            <Feature icon={<Users />} title="Friendship" />
          </div>
        </div>

      </div>

      {/* CONTACT */}
      <section className={styles.simpleContact}>
        <h3>Contact Us</h3>
        <p>Email: support@landlordz.com</p>
        <p>Phone: +91 98765 43210</p>
      </section>

      {/* FOOTER */}
      <footer className={styles.simpleFooter}>
        © 2026 LANDLORDZ | Smart Land Management
      </footer>

    </div>
  );
}
