import { NextResponse } from "next/server";
import sql from "mssql";
import { getDb } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { farmerId, property_name, location, geo_point } = await req.json();

    const db = await getDb();

    const result = await db.request()
      .input("farmer_id", sql.Int, farmerId)
      .input("property_name", sql.VarChar(100), property_name)
      .input("location", sql.VarChar(100), location)
      .input("geo_point", sql.VarChar(200), geo_point)
      .query(`
        INSERT INTO Properties (farmer_id, property_name, location, geo_point)
        OUTPUT INSERTED.property_id
        VALUES (@farmer_id, @property_name, @location, @geo_point)
      `);

    return NextResponse.json({
      success: true,
      property_id: result.recordset[0].property_id
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
