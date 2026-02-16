import { NextResponse } from "next/server";
import sql from "mssql";
import { getDb } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const farmerId = searchParams.get("farmerId");

    if (!farmerId) {
      return NextResponse.json([], { status: 200 });
    }

    const db = await getDb();

    const result = await db.request()
      .input("farmer_id", sql.Int, Number(farmerId))
      .query(`
        SELECT *
        FROM dbo.Properties
        WHERE farmer_id = @farmer_id
        ORDER BY property_id DESC
      `);

    return NextResponse.json(result.recordset);

  } catch (err) {
    console.error("LIST PROPERTY ERROR:", err);
    return NextResponse.json([], { status: 500 });
  }
}
