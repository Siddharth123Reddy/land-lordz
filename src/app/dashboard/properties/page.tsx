"use client";

import { useState } from "react";
import styles from "../dashboard.module.css";

export default function PropertiesPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [geoPoint, setGeoPoint] = useState("");

  const handleAddDocument = () => {
    setDocuments([
      ...documents,
      { document_type: "", image_base64: "" },
    ]);
  };

  const handleImageChange = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = [...documents];
      updated[index].image_base64 = reader.result;
      setDocuments(updated);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteDoc = (index: number) => {
    const updated = documents.filter((_, i) => i !== index);
    setDocuments(updated);
  };

  return (
    <div className={styles.propertyPage}>

      {/* Header */}
      <div className={styles.pageHeader}>
        <h2>Land Details Form</h2>
        <div className={styles.starIcon}>★</div>
      </div>

      {/* Upload Card */}
      <div className={styles.bigUploadCard}>
        <p>Please select images to upload</p>
      </div>

      {/* Property Documents */}
      <div className={styles.sectionHeader}>
        <h3>Property Documents</h3>
        <button
          className={styles.addDocBtn}
          onClick={handleAddDocument}
        >
          + Add Document
        </button>
      </div>

      {documents.map((doc, index) => (
        <div key={index} className={styles.documentCard}>

          <select
            value={doc.document_type}
            onChange={(e) => {
              const updated = [...documents];
              updated[index].document_type = e.target.value;
              setDocuments(updated);
            }}
            className={styles.inputField}
          >
            <option value="">Select Document Type</option>
            <option value="Sale Deed">Sale Deed</option>
            <option value="Tax Receipt">Tax Receipt</option>
            <option value="Ownership Proof">Ownership Proof</option>
          </select>

          <label className={styles.pickImageBtn}>
            Pick Image
            <input
              type="file"
              hidden
              onChange={(e) =>
                e.target.files &&
                handleImageChange(index, e.target.files[0])
              }
            />
          </label>

          <div className={styles.previewBox}>
            {doc.image_base64 ? (
              <img
                src={doc.image_base64}
                className={styles.previewImg}
              />
            ) : (
              "No image selected"
            )}
          </div>

          <button
            className={styles.deleteBtn}
            onClick={() => handleDeleteDoc(index)}
          >
            🗑 Delete document
          </button>
        </div>
      ))}

      {/* Geofence Section */}
      <div className={styles.geofenceSection}>
        <h3>Geofence Property</h3>

        <input
          type="text"
          placeholder="Geo point 1"
          value={geoPoint}
          onChange={(e) => setGeoPoint(e.target.value)}
          className={styles.inputField}
        />
      </div>

    </div>
  );
}
