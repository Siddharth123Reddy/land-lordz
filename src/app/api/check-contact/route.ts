import { NextResponse } from "next/server";
import sql from "mssql";
import { getDb } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const contact = body?.contact?.trim().toLowerCase();

    // 🔎 Validate input
    if (!contact) {
      return NextResponse.json(
        { message: "Contact is required" },
        { status: 400 }
      );
    }

    const db = await getDb();

    const result = await db
      .request()
      .input("contact", sql.NVarChar(100), contact)
      .query(`
        SELECT farmer_id
        FROM dbo.Farmers
        WHERE LOWER(LTRIM(RTRIM(contact))) = @contact
      `);

    return NextResponse.json({
      exists: result.recordset.length > 0,
    });

  } catch (err) {
    console.error("CHECK CONTACT ERROR:", err);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
