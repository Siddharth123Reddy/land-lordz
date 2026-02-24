import fs from "fs";
import path from "path";
import Papa from "papaparse";

export function getSoilData(state: string, district: string) {
  try {
    const filePath = path.join(
      process.cwd(),
      "src",
      "data",
      "CropDataset-Enhanced.csv"
    );

    const file = fs.readFileSync(filePath, "utf8");

    const parsed = Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(), // 🔥 remove header spaces
    });

    const records: any[] = parsed.data as any[];

    // 🔎 Match State + District
    const filtered = records.filter((row) => {
  const region = row.Region?.trim().toLowerCase();

  // 🔥 Extract only district name before comma
  const address = row.Address
    ?.split(",")[0]
    ?.trim()
    .toLowerCase();

  return (
    region === state.trim().toLowerCase() &&
    address === district.trim().toLowerCase()
  );
});

    if (filtered.length === 0) {
      console.log("No soil match found for:", state, district);
      return null;
    }

    const first = filtered[0];

    // ✅ Safely parse % values
    const acidic = parseFloat(
      (first["pH - Acidic"] || "0").toString().replace("%", "")
    );

    const neutral = parseFloat(
      (first["pH - Neutral"] || "0").toString().replace("%", "")
    );

    const alkaline = parseFloat(
      (first["pH - Alkaline"] || "0").toString().replace("%", "")
    );7

    // 🔥 Pick highest percentage
    let phCategory = "Unknown";

    if (acidic >= neutral && acidic >= alkaline) {
      phCategory = "Acidic";
    } else if (neutral >= acidic && neutral >= alkaline) {
      phCategory = "Neutral";
    } else {
      phCategory = "Alkaline";
    }

    // ✅ Detect Crop column safely
    const cropKey = Object.keys(first).find(
      (key) => key.trim().toLowerCase() === "crop"
    );

    const cropsValue = cropKey ? first[cropKey] : "";

    return {
      phCategory,
      crops: cropsValue?.toString().trim() || "",
    };

  } catch (error) {
    console.error("Soil Data Error:", error);
    return null;
  }
}