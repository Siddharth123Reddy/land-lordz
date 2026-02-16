import { NextResponse } from "next/server";
import sql from "mssql";
import { getDb } from "@/lib/db";

/* ===============================
   GET - List Properties
================================= */

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const farmer_id = searchParams.get("farmer_id");

    if (!farmer_id) {
      return NextResponse.json(
        { error: "farmer_id is required" },
        { status: 400 }
      );
    }

    const pool = await getDb();

    const result = await pool.request()
      .input("farmer_id", sql.Int, farmer_id)
      .query(`
        SELECT *
        FROM Properties
        WHERE farmer_id = @farmer_id
        ORDER BY created_at DESC
      `);

    return NextResponse.json(result.recordset);

  } catch (error) {
    console.error("GET Properties Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 }
    );
  }
}

/* ===============================
   POST - Add Property
================================= */

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

    const pool = await getDb();

    const result = await pool.request()
      .input("farmer_id", sql.Int, farmer_id)
      .input("property_name", sql.VarChar(150), property_name)
      .input("property_type", sql.VarChar(100), property_type)
      .input("location", sql.VarChar(150), location)
      .input("geo_location", sql.VarChar(255), geo_location)
      .input("property_image", sql.NVarChar(sql.MAX), property_image)
      .input("property_meta", sql.NVarChar(sql.MAX), property_meta)
      .query(`
        INSERT INTO Properties
        (
          farmer_id,
          property_name,
          property_type,
          location,
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
          @geo_location,
          @property_image,
          @property_meta,
          GETDATE()
        )
      `);

    return NextResponse.json({
      success: true,
      property_id: result.recordset[0].property_id,
    });

  } catch (error) {
    console.error("POST Property Error:", error);
    return NextResponse.json(
      { error: "Failed to add property" },
      { status: 500 }
    );
  }
}
