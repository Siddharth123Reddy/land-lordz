"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../dashboard.module.css";
import { propertyQuestions } from "@/lib/propertyQuestions";

type PropertyType =
  | "Agricultural"
  | "Residential"
  | "Commercial"
  | "Industrial"
  | "";

export default function AddPropertyPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [propertyType, setPropertyType] = useState<PropertyType>("");
  const [propertyName, setPropertyName] = useState("");
  const [location, setLocation] = useState("");
  const [geoLocation, setGeoLocation] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [imageBase64, setImageBase64] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [documentBase64, setDocumentBase64] = useState("");
  const [loading, setLoading] = useState(false);

  const questions =
    propertyType !== ""
      ? propertyQuestions[propertyType as keyof typeof propertyQuestions]
      : [];

  const handleFileUpload = (file: File, type: "property" | "document") => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "property") {
        setImageBase64(reader.result as string);
      } else {
        setDocumentBase64(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    const farmer_id = localStorage.getItem("farmer_id");

    if (!farmer_id) {
      alert("User not authenticated");
      router.push("/login");
      return;
    }

    if (!propertyName || !propertyType || !location) {
      alert("Please fill required fields");
      return;
    }

    setLoading(true);

    try {
      const propertyMeta = JSON.stringify(answers);

      const res = await fetch("/api/properties/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmer_id: Number(farmer_id),
          property_name: propertyName,
          property_type: propertyType,
          location,
          geo_location: geoLocation,
          property_image: imageBase64,
          property_meta: propertyMeta,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.property_id) {
        alert(result.error || "Failed to create property");
        setLoading(false);
        return;
      }

      const propertyId = result.property_id;

      if (documentType && documentBase64) {
        await fetch("/api/properties/documents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            property_id: propertyId,
            document_type: documentType,
            file_base64: documentBase64,
          }),
        });
      }

      alert("Property Created Successfully ✅");
      router.push("/dashboard/properties");

    } catch (error) {
      console.error(error);
      alert("Error saving property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formPageContainer}>
      <div className={styles.formCard}>
        <h2 className={styles.formTitle}>Add New Property</h2>

        {/* STEP 1 */}
        {step === 1 && (
          <div className={styles.stepSection}>
            <h3>Select Property Type</h3>
            <div className={styles.typeGrid}>
              {["Agricultural", "Residential", "Commercial", "Industrial"].map(
                (type) => (
                  <button
                    key={type}
                    className={styles.typeButton}
                    onClick={() => {
                      setPropertyType(type as PropertyType);
                      setStep(2);
                    }}
                  >
                    {type}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className={styles.stepSection}>
            <input
              className={styles.input}
              placeholder="Property Name"
              value={propertyName}
              onChange={(e) => setPropertyName(e.target.value)}
            />

            <input
              className={styles.input}
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <input
              className={styles.input}
              placeholder="Geo Location"
              value={geoLocation}
              onChange={(e) => setGeoLocation(e.target.value)}
            />

            {questions.map((q) => (
              <input
                key={q.key}
                className={styles.input}
                placeholder={q.label}
                value={answers[q.key] || ""}
                onChange={(e) =>
                  setAnswers({
                    ...answers,
                    [q.key]: e.target.value,
                  })
                }
              />
            ))}

            <button
              className={styles.primaryBtn}
              onClick={() => setStep(3)}
            >
              Next
            </button>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className={styles.stepSection}>
            <label className={styles.fileLabel}>
              Upload Property Image
            </label>

            <input
              type="file"
              onChange={(e) =>
                e.target.files &&
                handleFileUpload(e.target.files[0], "property")
              }
            />

            <button
              className={styles.primaryBtn}
              onClick={() => setStep(4)}
            >
              Next
            </button>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div className={styles.stepSection}>
            <select
              className={styles.input}
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
            >
              <option value="">Select Document Type</option>
              <option value="Title Deed">Title Deed</option>
              <option value="Sale Agreement">Sale Agreement</option>
              <option value="Lease Agreement">Lease Agreement</option>
            </select>

            <input
              type="file"
              onChange={(e) =>
                e.target.files &&
                handleFileUpload(e.target.files[0], "document")
              }
            />

            <button
              className={styles.primaryBtn}
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Property"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
