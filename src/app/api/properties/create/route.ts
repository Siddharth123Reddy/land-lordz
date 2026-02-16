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
      geo_location,
      property_image,
      property_meta,
    } = body;

    if (!farmer_id || !property_name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const pool = await getDb();

    /* ===============================
       INSERT PROPERTY + RETURN ID
    =============================== */
    const result = await pool.request()
      .input("farmer_id", sql.Int, farmer_id)
      .input("property_name", sql.VarChar(150), property_name)
      .input("property_type", sql.VarChar(100), property_type)
      .input("location", sql.VarChar(150), location)
      .input("geo_location", sql.VarChar(255), geo_location)
      .input("property_image", sql.NVarChar(sql.MAX), property_image || null)
      .input("property_meta", sql.NVarChar(sql.MAX), property_meta || null)
      .query(`
        INSERT INTO Properties
        (farmer_id, property_name, property_type, location, geo_location, property_image, property_meta, created_at)
        OUTPUT INSERTED.property_id
        VALUES
        (@farmer_id, @property_name, @property_type, @location, @geo_location, @property_image, @property_meta, GETDATE())
      `);

    const newPropertyId = result.recordset[0].property_id;

    return NextResponse.json({
      success: true,
      property_id: newPropertyId,
    });

  } catch (error) {
    console.error("Create Property Error:", error);
    return NextResponse.json(
      { error: "Failed to create property" },
      { status: 500 }
    );
  }
}
