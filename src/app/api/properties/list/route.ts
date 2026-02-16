import { NextResponse } from "next/server";
import sql from "mssql";
import { getDb } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const property_id = searchParams.get("property_id");
    const farmer_id = searchParams.get("farmer_id");

    const pool = await getDb();

    /* ===============================
       1️⃣ Get Single Property (Full Details)
    =============================== */
    if (property_id) {
      const result = await pool.request()
        .input("property_id", sql.Int, Number(property_id))
        .query(`
          SELECT 
            property_id,
            property_name,
            property_type,
            location,
            geo_location,
            property_image,
            property_meta,
            created_at
          FROM Properties
          WHERE property_id = @property_id
        `);

      return NextResponse.json(result.recordset);
    }

    /* ===============================
       2️⃣ Get Properties By Farmer (LIGHTWEIGHT)
       ⚠️ DO NOT RETURN IMAGE OR META HERE
    =============================== */
    if (farmer_id) {
      const result = await pool.request()
        .input("farmer_id", sql.Int, Number(farmer_id))
        .query(`
          SELECT 
            property_id,
            property_name,
            property_type,
            location,
            created_at
          FROM Properties
          WHERE farmer_id = @farmer_id
          ORDER BY created_at DESC
        `);

      return NextResponse.json(result.recordset);
    }

    return NextResponse.json(
      { error: "farmer_id or property_id is required" },
      { status: 400 }
    );

  } catch (error) {
    console.error("List Properties Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 }
    );
  }
}
