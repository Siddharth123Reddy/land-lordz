import { NextResponse } from "next/server";
import sql from "mssql";
import { getDb } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      farmer_id,
      property_name,
      property_type,
      location,
      STATE,
      DISTRICT,
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

    const pool = await getDb();

    /* ===============================
       2️⃣ Insert Property
    =============================== */
    const result = await pool
      .request()
      .input("farmer_id", sql.Int, farmer_id)
      .input("property_name", sql.VarChar(150), property_name)
      .input("property_type", sql.VarChar(100), property_type || null)
      .input("location", sql.VarChar(150), location || null)
      .input("STATE", sql.VarChar(100), STATE || null)
      .input("DISTRICT", sql.VarChar(100), DISTRICT || null)
      .input("geo_location", sql.VarChar(255), geo_location || null)
      .input("property_image", sql.NVarChar(sql.MAX), property_image || null)
      .input("property_meta", sql.NVarChar(sql.MAX), property_meta || null)
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
