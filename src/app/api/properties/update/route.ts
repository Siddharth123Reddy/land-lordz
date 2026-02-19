import { NextResponse } from "next/server";
import sql from "mssql";
import { getDb } from "@/lib/db";

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const {
      property_id,
      property_name,
      property_type,
      location,
      STATE,
      DISTRICT,
      geo_location,
      property_image,
      property_meta,
    } = body;

    const pool = await getDb();

    await pool.request()
      .input("property_id", sql.Int, property_id)
      .input("property_name", sql.VarChar(150), property_name)
      .input("property_type", sql.VarChar(100), property_type)
      .input("location", sql.VarChar(150), location)
      .input("STATE", sql.VarChar(100), STATE)
      .input("DISTRICT", sql.VarChar(100), DISTRICT)
      .input("geo_location", sql.VarChar(255), geo_location)
      .input("property_image", sql.NVarChar(sql.MAX), property_image)
      .input("property_meta", sql.NVarChar(sql.MAX), property_meta)
      .query(`
        UPDATE Properties
        SET
          property_name = @property_name,
          property_type = @property_type,
          location = @location,
          STATE = @STATE,
          DISTRICT = @DISTRICT,
          geo_location = @geo_location,
          property_image = @property_image,
          property_meta = @property_meta
        WHERE property_id = @property_id
      `);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Update Property Error:", error);
    return NextResponse.json(
      { error: "Failed to update property" },
      { status: 500 }
    );
  }
}
