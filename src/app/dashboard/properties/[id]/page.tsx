"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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
        // PROPERTY
        const propertyRes = await fetch(
          `/api/properties/list?property_id=${propertyId}`
        );
        const propertyData = await propertyRes.json();

        if (propertyData.length > 0) {
          setProperty(propertyData[0]);
        }

        // DOCUMENT
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

  if (!property) return <div>Loading...</div>;

  const meta =
    property.property_meta && property.property_meta !== ""
      ? JSON.parse(property.property_meta)
      : {};

  return (
    <div style={{ padding: 30 }}>
      <h2>{property.property_name}</h2>

      {/* IMAGE */}
      {property.property_image && (
        <img
          src={property.property_image}
          alt="Property"
          style={{
            width: "100%",
            height: 300,
            objectFit: "cover",
            borderRadius: 10,
            marginBottom: 20,
          }}
        />
      )}

      <p>
        <strong>Type:</strong> {property.property_type}
      </p>
      <p>
        <strong>Location:</strong> {property.location}
      </p>
      <p>
        <strong>Geo Location:</strong> {property.geo_location}
      </p>

      <hr />

      <h3>Additional Details</h3>

      {Object.entries(meta).length === 0 && (
        <p>No additional details.</p>
      )}

      {Object.entries(meta).map(([key, value]) => (
        <p key={key}>
          <strong>{key}:</strong> {value as string}
        </p>
      ))}

      <hr />

      <h3>Document</h3>

      {!documentData && <p>No document found.</p>}

      {documentData && (
        <>
          <p>
            <strong>Type:</strong> {documentData.document_type}
          </p>

          <iframe
            src={documentData.file_base64}
            width="100%"
            height="500px"
            style={{ border: "none", borderRadius: 10 }}
          />
        </>
      )}

      <br />

      <button onClick={() => router.back()}>
        Back
      </button>

      <button
        onClick={handleDelete}
        style={{
          marginLeft: 10,
          background: "red",
          color: "white",
          padding: "8px 16px",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Delete Property
      </button>
    </div>
  );
}
