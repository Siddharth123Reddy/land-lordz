"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "../../dashboard.module.css";

type Property = {
  property_id: number;
  property_name: string;
  property_type: string;
  location: string;
  geo_location: string;
  property_image: string;
  property_meta: string;
};

type DocumentType = {
  document_type: string;
  file_base64: string;
};

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [documentData, setDocumentData] =
    useState<DocumentType | null>(null);

  useEffect(() => {
    if (!propertyId) return;

    const fetchData = async () => {
      try {
        const propertyRes = await fetch(
          `/api/properties/list?property_id=${propertyId}`
        );
        const propertyData = await propertyRes.json();

        if (propertyData.length > 0) {
          setProperty(propertyData[0]);
        }

        const docRes = await fetch(
          `/api/properties/documents?property_id=${propertyId}`
        );
        const docData = await docRes.json();

        if (docData.length > 0) {
          setDocumentData(docData[0]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [propertyId]);

  const handleDelete = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this property?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `/api/properties/delete?property_id=${propertyId}`,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Property deleted successfully");
        router.push("/dashboard/properties");
      } else {
        alert(data.error || "Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong");
    }
  };

  if (!property) {
    return (
      <div className={styles.loadingContainer}>
        <p>Loading property details...</p>
      </div>
    );
  }

  const meta =
    property.property_meta && property.property_meta !== ""
      ? JSON.parse(property.property_meta)
      : {};

  return (
    <div className={styles.propertyContainer}>
      <div className={styles.propertyCard}>

        <div className={styles.propertyHeader}>
          <h2 className={styles.propertyTitle}>
            {property.property_name}
          </h2>
          <span className={styles.propertyTypeBadge}>
            {property.property_type}
          </span>
        </div>

        {property.property_image && (
          <img
            src={property.property_image}
            alt="Property"
            className={styles.propertyImage}
          />
        )}

        <div className={styles.infoGrid}>
          <div>
            <strong>Location</strong>
            <p>{property.location}</p>
          </div>

          <div>
            <strong>Geo Location</strong>
            <p>{property.geo_location}</p>
          </div>
        </div>

        <div className={styles.divider} />

        <h3 className={styles.sectionTitle}>
          Additional Details
        </h3>

        {Object.entries(meta).length === 0 ? (
          <p className={styles.emptyText}>
            No additional details available.
          </p>
        ) : (
          <div className={styles.metaGrid}>
            {Object.entries(meta).map(([key, value]) => (
              <div key={key} className={styles.metaItem}>
                <strong>{key}</strong>
                <p>{value as string}</p>
              </div>
            ))}
          </div>
        )}

        <div className={styles.divider} />

        <h3 className={styles.sectionTitle}>Document</h3>

        {!documentData ? (
          <p className={styles.emptyText}>
            No document uploaded.
          </p>
        ) : (
          <div className={styles.documentSection}>
            <p>
              <strong>Document Type:</strong>{" "}
              {documentData.document_type}
            </p>

            <iframe
              src={documentData.file_base64}
              className={styles.documentFrame}
            />
          </div>
        )}

        <div className={styles.buttonRow}>
          <button
            className={styles.secondaryBtn}
            onClick={() => router.back()}
          >
            Back
          </button>

          <button
            className={styles.dangerBtn}
            onClick={handleDelete}
          >
            Delete Property
          </button>
        </div>

      </div>
    </div>
  );
}
