"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../dashboard.module.css";

type Property = {
  property_id: number;
  property_name: string | null;
  property_type: string | null;
  location: string | null;
  property_image: string | null;
};

export default function PropertiesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const farmerId = localStorage.getItem("farmer_id");

    if (!farmerId) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/properties/list?farmer_id=${farmerId}`
        );
        const data = await res.json();

        setProperties(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch error:", err);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Loading properties...</p>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>My Properties</h2>
          <p className={styles.pageSubtitle}>
            Manage and view all your registered lands
          </p>
        </div>

        <button
          className={styles.primaryBtn}
          onClick={() =>
            router.push("/dashboard/properties/add")
          }
        >
          + Add Property
        </button>
      </div>

      <div className={styles.propertyGrid}>
        {properties.length === 0 && (
          <p className={styles.emptyText}>
            No properties found.
          </p>
        )}

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
            <img
              src={
                property.property_image &&
                property.property_image.startsWith("data:image")
                  ? property.property_image
                  : "/no-image.png"
              }
              alt="Property"
              className={styles.propertyImage}
            />

            <div className={styles.propertyContent}>
              <h3>
                {property.property_name ||
                  "Unnamed Property"}
              </h3>

              <p>
                {property.property_type ||
                  "No Type"}
              </p>

              <span>
                {property.location ||
                  "No Location"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
