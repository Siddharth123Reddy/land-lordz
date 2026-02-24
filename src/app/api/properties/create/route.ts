import { NextResponse } from "next/server";
import sql from "mssql";
import { getDb } from "@/lib/db";

import { getSoilData } from "@/lib/getSoilData"; // ✅ Added

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      farmer_id,
      property_name,
      property_type,
      location,
      state,
      district,
      geo_location,
      property_image,
      property_meta,
    } = body;

    /* ===============================
       1️⃣ Basic Validation
    =============================== */
    if (!farmer_id || !property_name) {
      return NextResponse.json(
        { success: false, error: "farmer_id and property_name are required" },
        { status: 400 }
      );
    }

    /* ===============================
       2️⃣ Get Climate Data
    =============================== */
   

    /* ===============================
       3️⃣ Get Soil Data (NEW)
    =============================== */
    let soilInfo = null;

    if (state && district) {
      soilInfo = getSoilData(state, district);
    }
    console.log("Soil Info:", soilInfo);
    

    const pool = await getDb();

    /* ===============================
       4️⃣ Insert Property
    =============================== */
    const result = await pool
      .request()
      .input("farmer_id", sql.Int, farmer_id)
      .input("property_name", sql.VarChar(150), property_name)
      .input("property_type", sql.VarChar(100), property_type || null)
      .input("location", sql.VarChar(150), location || null)
      .input("STATE", sql.VarChar(100), state || null)
      .input("DISTRICT", sql.VarChar(100), district || null)
      .input("geo_location", sql.VarChar(255), geo_location || null)
      .input("property_image", sql.NVarChar(sql.MAX), property_image || null)
      .input("property_meta", sql.NVarChar(sql.MAX), property_meta || null)
      
      .input("climate_days", sql.Int, 30)

      // ✅ NEW Soil Fields
      .input("soil_ph", sql.VarChar(50), soilInfo?.phCategory ?? null)
      .input(
        "recommended_crops",
        sql.NVarChar(sql.MAX),
        soilInfo ? JSON.stringify(soilInfo.crops) : null
      )

      .query(`
        INSERT INTO Properties
        (
          farmer_id,
          property_name,
          property_type,
          location,
          STATE,
          DISTRICT,
          geo_location,
          property_image,
          property_meta,
         
          soil_ph,
          recommended_crops,
          created_at
        )
        OUTPUT INSERTED.property_id
        VALUES
        (
          @farmer_id,
          @property_name,
          @property_type,
          @location,
          @STATE,
          @DISTRICT,
          @geo_location,
          @property_image,
          @property_meta,
        
          @soil_ph,
          @recommended_crops,
          GETDATE()
        )
      `);

    const newPropertyId = result.recordset[0].property_id;

    return NextResponse.json({
      success: true,
      property_id: newPropertyId,
    });

  } catch (error: any) {
    console.error("Create Property Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create property",
      },
      { status: 500 }
    );
  }
}