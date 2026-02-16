import { NextResponse } from "next/server";
import sql from "mssql";
import { getDb } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      farmerId,
      property_name,
      property_type,
      location,
      geo_location,
      property_image,
    } = body;

    if (!farmerId) {
      return NextResponse.json(
        { error: "farmerId missing" },
        { status: 400 }
      );
    }

    const db = await getDb();

    await db.request()
      .input("farmer_id", sql.Int, Number(farmerId))
      .input("property_name", sql.VarChar, property_name)
      .input("property_type", sql.VarChar, property_type)
      .input("location", sql.VarChar, location)
      .input("geo_location", sql.VarChar, geo_location)
      .input("property_image", sql.VarChar(sql.MAX), property_image)
      .query(`
        INSERT INTO dbo.Properties
        (
          farmer_id,
          property_name,
          property_type,
          location,
          geo_location,
          property_image
        )
        VALUES
        (
          @farmer_id,
          @property_name,
          @property_type,
          @location,
          @geo_location,
          @property_image
        )
      `);

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("CREATE PROPERTY ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
