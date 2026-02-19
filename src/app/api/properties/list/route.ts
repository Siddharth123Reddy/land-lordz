import { NextResponse } from "next/server";
import sql from "mssql";
import { getDb } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const property_id = searchParams.get("property_id");
    const farmer_id = searchParams.get("farmer_id");

    const pool = await getDb();

    /* ============================================
       1️⃣ Get Single Property (Full Details)
    ============================================ */
    if (property_id) {
      const result = await pool
        .request()
        .input("property_id", sql.Int, Number(property_id))
        .query(`
          SELECT 
            property_id,
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
          FROM Properties
          WHERE property_id = @property_id
        `);

      return NextResponse.json({
        success: true,
        property: result.recordset[0] || null,
      });
    }

    /* ============================================
       2️⃣ Get Properties By Farmer
    ============================================ */
    if (farmer_id) {
      const result = await pool
        .request()
        .input("farmer_id", sql.Int, Number(farmer_id))
        .query(`
          SELECT *
          FROM (
              SELECT 
                property_id,
                farmer_id,
                property_name,
                property_type,
                location,
                STATE,
                DISTRICT,
                property_image,
                created_at,
                ROW_NUMBER() OVER (
                    PARTITION BY property_name 
                    ORDER BY created_at DESC
                ) AS rn
              FROM Properties
              WHERE farmer_id = @farmer_id
          ) t
          WHERE rn = 1
          ORDER BY created_at DESC
        `);

      return NextResponse.json({
        success: true,
        properties: result.recordset,
      });
    }

    return NextResponse.json(
      { success: false, error: "farmer_id or property_id is required" },
      { status: 400 }
    );

  } catch (error: any) {
    console.error("List Properties Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch properties",
      },
      { status: 500 }
    );
  }
}
