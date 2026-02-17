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

  const [metaData, setMetaData] = useState<any>({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newImage, setNewImage] = useState<string | null>(null);
  const [newDocument, setNewDocument] = useState<string | null>(null);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    if (!propertyId) return;

    const fetchData = async () => {
      const propertyRes = await fetch(
        `/api/properties/list?property_id=${propertyId}`
      );
      const propertyData = await propertyRes.json();

      if (propertyData.length > 0) {
        setProperty(propertyData[0]);

        const meta =
          propertyData[0].property_meta &&
          propertyData[0].property_meta !== ""
            ? JSON.parse(propertyData[0].property_meta)
            : {};

        setMetaData(meta);
      }

      const docRes = await fetch(
        `/api/properties/documents?property_id=${propertyId}`
      );
      const docData = await docRes.json();

      if (docData.length > 0) {
        setDocumentData(docData[0]);
      }
    };

    fetchData();
  }, [propertyId]);

  /* ================= HANDLERS ================= */

  const handleChange = (e: any) => {
    if (!property) return;
    setProperty({
      ...property,
      [e.target.name]: e.target.value,
    });
  };

  const handleMetaChange = (key: string, value: string) => {
    setMetaData({
      ...metaData,
      [key]: value,
    });
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDocumentChange = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewDocument(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  /* ================= UPDATE ================= */

  const handleUpdate = async () => {
    if (!property) return;

    setLoading(true);

    try {
      // 1️⃣ Update Property
      await fetch("/api/properties/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...property,
          property_image: newImage || property.property_image,
          property_meta: JSON.stringify(metaData),
        }),
      });

      // 2️⃣ Update Document (if new uploaded)
      if (newDocument) {
        await fetch("/api/properties/documents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            property_id: property.property_id,
            file_base64: newDocument,
            document_type: "Updated Document",
          }),
        });
      }

      alert("Property updated successfully");
      setEditing(false);
    } catch (error) {
      console.error(error);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this property?"
    );

    if (!confirmDelete) return;

    await fetch(
      `/api/properties/delete?property_id=${propertyId}`,
      { method: "DELETE" }
    );

    router.push("/dashboard/properties");
  };

  if (!property) {
    return (
      <div className={styles.loadingContainer}>
        <p>Loading property details...</p>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.propertyContainer}>
        <div className={styles.propertyCard}>

          {/* HEADER */}
          <div className={styles.propertyHeader}>
            {editing ? (
              <input
                name="property_name"
                value={property.property_name}
                onChange={handleChange}
                className={styles.inputField}
              />
            ) : (
              <h2 className={styles.propertyTitle}>
                {property.property_name}
              </h2>
            )}

            {editing ? (
              <input
                name="property_type"
                value={property.property_type}
                onChange={handleChange}
                className={styles.inputField}
              />
            ) : (
              <span className={styles.propertyTypeBadge}>
                {property.property_type}
              </span>
            )}
          </div>

          {/* IMAGE */}
          <div>
            {(newImage || property.property_image) && (
              <img
                src={newImage || property.property_image}
                alt="Property"
                className={styles.propertyImage}
              />
            )}

            {editing && (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            )}
          </div>

          {/* LOCATION */}
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <strong>Location</strong>
              {editing ? (
                <input
                  name="location"
                  value={property.location}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              ) : (
                <p>{property.location}</p>
              )}
            </div>

            <div className={styles.infoCard}>
              <strong>Geo Location</strong>
              {editing ? (
                <input
                  name="geo_location"
                  value={property.geo_location}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              ) : (
                <p>{property.geo_location}</p>
              )}
            </div>
          </div>

          {/* ADDITIONAL DETAILS */}
          <h3 className={styles.sectionTitle}>
            Additional Details
          </h3>

          <div className={styles.metaGrid}>
            {Object.entries(metaData).map(([key, value]) => (
              <div key={key} className={styles.metaItem}>
                <strong>{key}</strong>

                {editing ? (
                  <input
                    value={value as string}
                    onChange={(e) =>
                      handleMetaChange(key, e.target.value)
                    }
                    className={styles.inputField}
                  />
                ) : (
                  <p>{value as string}</p>
                )}
              </div>
            ))}
          </div>

          {/* DOCUMENT */}
          <h3 className={styles.sectionTitle}>Document</h3>

          {(newDocument || documentData?.file_base64) ? (
            <iframe
              src={newDocument || documentData?.file_base64}
              className={styles.documentFrame}
            />
          ) : (
            <p>No document uploaded.</p>
          )}

          {editing && (
            <input
              type="file"
              accept="application/pdf,image/*"
              onChange={handleDocumentChange}
            />
          )}

          {/* BUTTONS */}
          <div className={styles.buttonRow}>
            <button
              className={styles.secondaryBtn}
              onClick={() => router.back()}
            >
              Back
            </button>

            {!editing ? (
              <>
                <button
                  className={styles.primaryBtn}
                  onClick={() => setEditing(true)}
                >
                  Edit
                </button>

                <button
                  className={styles.dangerBtn}
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </>
            ) : (
              <>
                <button
                  className={styles.primaryBtn}
                  onClick={handleUpdate}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>

                <button
                  className={styles.secondaryBtn}
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
