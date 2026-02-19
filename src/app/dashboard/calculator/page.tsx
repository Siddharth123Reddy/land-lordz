"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./calculator.module.css";

type PropertyList = {
  property_id: number;
  property_name: string | null;
  property_type: string | null;
  location: string | null;
  property_image: string | null;
};

type PropertyFull = {
  property_id: number;
  property_name: string;
  STATE: string;
  DISTRICT: string;
  geo_location: string;
  property_meta: string | null;
};

// Decorative SVG icons
const LeafIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
);

const PinIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

const SoilIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9,22 9,12 15,12 15,22"/>
  </svg>
);

const TempIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
  </svg>
);

const RainIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <line x1="16" y1="13" x2="16" y2="21"/><line x1="8" y1="13" x2="8" y2="21"/>
    <line x1="12" y1="15" x2="12" y2="23"/>
    <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/>
  </svg>
);

const CropIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 22V12M12 12C12 12 7 10 5 6c3 0 6 2 7 6zM12 12c0 0 5-2 7-6-3 0-6 2-7 6z"/>
    <path d="M5 3v4M19 3v4"/>
  </svg>
);

// Fallback farm images from Unsplash (free, no auth needed)
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80",
  "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80",
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&q=80",
  "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&q=80",
];

const CROP_DATA = [
  { name: "Rice", icon: "🌾", color: "#e8f5e9" },
  { name: "Wheat", icon: "🌿", color: "#fff8e1" },
  { name: "Maize", icon: "🌽", color: "#fff3e0" },
  { name: "Cotton", icon: "☁️", color: "#e3f2fd" },
  { name: "Sugarcane", icon: "🎋", color: "#e8f5e9" },
  { name: "Pulses", icon: "🫘", color: "#fce4ec" },
];

export default function CalculatorPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<PropertyList[]>([]);
  const [selected, setSelected] = useState<PropertyFull | null>(null);

  useEffect(() => {
    const farmerId = localStorage.getItem("farmer_id");
    if (!farmerId) {
      router.push("/login");
      return;
    }

    fetch(`/api/properties/list?farmer_id=${farmerId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProperties(data.properties);
      });
  }, [router]);

  const fetchFullProperty = async (id: number) => {
    const res = await fetch(`/api/properties/list?property_id=${id}`);
    const data = await res.json();
    if (data.success) setSelected(data.property);
  };

  if (!selected) {
    return (
      <div className={styles.pageWrapper}>
        {/* Hero Banner */}
        <div className={styles.heroBanner}>
          <div className={styles.heroOverlay} />
          <img
            className={styles.heroImg}
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&q=80"
            alt="Farm landscape"
          />
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <LeafIcon /> Crop Intelligence
            </div>
            <h1 className={styles.heroTitle}>Farm Calculator</h1>
            <p className={styles.heroSub}>
              Select a property to analyse soil health, climate data &amp; recommended crops
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className={styles.gridSection}>
          <p className={styles.gridLabel}>Your Properties — click to analyse</p>
          <div className={styles.grid}>
            {properties.map((property, i) => (
              <div
                key={property.property_id}
                className={styles.card}
                onClick={() => fetchFullProperty(property.property_id)}
              >
                <div className={styles.cardImgWrap}>
                  <img
                    src={
                      property.property_image &&
                      property.property_image.startsWith("data:image")
                        ? property.property_image
                        : FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]
                    }
                    alt="Property"
                  />
                  <div className={styles.cardImgOverlay} />
                  <span className={styles.cardBadge}>
                    {property.property_type || "Agricultural"}
                  </span>
                </div>
                <div className={styles.cardBody}>
                  <h3>{property.property_name || "Unnamed Property"}</h3>
                  <div className={styles.cardLocation}>
                    <PinIcon />
                    {property.location || "—"}
                  </div>
                  <div className={styles.cardCta}>View Analysis →</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const meta = selected.property_meta ? JSON.parse(selected.property_meta) : {};

  const sideItems = [
    { label: "Soil pH", icon: <SoilIcon />, value: meta?.soil_ph || "—", unit: "pH", accent: "#5e8a3a" },
    { label: "Temperature", icon: <TempIcon />, value: meta?.temperature || "—", unit: "°C", accent: "#d97706" },
    { label: "Rainfall", icon: <RainIcon />, value: meta?.rainfall || "—", unit: "mm", accent: "#3b82f6" },
    { label: "Crops Grown", icon: <CropIcon />, value: meta?.crops_grown || "—", unit: "", accent: "#7c3aed" },
  ];

  return (
    <div className={styles.detailPage}>

      {/* TOP HERO STRIP */}
      <div className={styles.detailHero}>
        <img
          className={styles.detailHeroImg}
          src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1400&q=80"
          alt="farm"
        />
        <div className={styles.detailHeroOverlay} />
        <div className={styles.detailHeroText}>
          <button className={styles.backBtn} onClick={() => setSelected(null)}>
            ← Back to Properties
          </button>
          <h1 className={styles.detailTitle}>{selected.property_name}</h1>
          <div className={styles.detailBreadcrumb}>
            <span>{selected.STATE}</span>
            <span className={styles.sep}>›</span>
            <span>{selected.DISTRICT}</span>
            <span className={styles.sep}>›</span>
            <span className={styles.geo}>{selected.geo_location}</span>
          </div>
        </div>
      </div>

      {/* MAIN BODY */}
      <div className={styles.mainLayout}>

        {/* LEFT */}
        <div className={styles.leftWrapper}>

          {/* Location Cards */}
          <div className={styles.locationStrip}>
            {[
              { label: "State", value: selected.STATE, icon: "🗺️" },
              { label: "District", value: selected.DISTRICT, icon: "📍" },
              { label: "Geo Location", value: selected.geo_location, icon: "🌐" },
            ].map((item) => (
              <div key={item.label} className={styles.locationChip}>
                <span className={styles.locationChipIcon}>{item.icon}</span>
                <div>
                  <span className={styles.locationChipLabel}>{item.label}</span>
                  <p className={styles.locationChipValue}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Details */}
          <div className={styles.detailsContainer}>
            <div className={styles.containerHeader}>
              <LeafIcon />
              <h3>Property Details</h3>
            </div>
            <div className={styles.detailsBoxes}>
              {Object.entries(meta).length > 0 ? (
                Object.entries(meta).map(([key, value]) => (
                  <div key={key} className={styles.detailBox}>
                    <span>{key.replace(/_/g, " ")}</span>
                    <p>{String(value)}</p>
                  </div>
                ))
              ) : (
                <p className={styles.emptyMeta}>No additional details available.</p>
              )}
            </div>
          </div>

          {/* Recommended Crops */}
          <div className={styles.cropsContainer}>
            <div className={styles.containerHeader}>
              <span>🌱</span>
              <h3>Recommended Crops</h3>
            </div>
            <p className={styles.cropsSubtitle}>
              Based on soil type, climate &amp; location data
            </p>
            <div className={styles.cropRow}>
              {CROP_DATA.map((crop) => (
                <div
                  key={crop.name}
                  className={styles.cropTag}
                  style={{ "--crop-bg": crop.color } as React.CSSProperties}
                >
                  <span>{crop.icon}</span>
                  {crop.name}
                </div>
              ))}
            </div>

            {/* Farm image collage */}
            <div className={styles.cropImgRow}>
              {[
                "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=300&q=75",
                "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=300&q=75",
                "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=300&q=75",
              ].map((src, i) => (
                <img key={i} src={src} alt="crop" className={styles.cropImg} />
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className={styles.rightPanel}>
          <p className={styles.rightPanelLabel}>Field Metrics</p>
          {sideItems.map((item) => (
            <div
              key={item.label}
              className={styles.sideBox}
              style={{ "--accent": item.accent } as React.CSSProperties}
            >
              <div className={styles.sideBoxIcon} style={{ color: item.accent }}>
                {item.icon}
              </div>
              <div className={styles.sideBoxContent}>
                <span className={styles.sideBoxLabel}>{item.label}</span>
                <p className={styles.sideBoxValue}>
                  {item.value}
                  {item.unit && <small> {item.unit}</small>}
                </p>
              </div>
              <div className={styles.sideBoxBar} style={{ background: item.accent }} />
            </div>
          ))}

          {/* Small landscape photo */}
          <div className={styles.sidePhotoCard}>
            <img
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=75"
              alt="landscape"
            />
            <div className={styles.sidePhotoOverlay}>
              <span>🌤️ Field Overview</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}