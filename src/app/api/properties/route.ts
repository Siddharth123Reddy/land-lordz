import { NextResponse } from "next/server";
import sql from "mssql";
import { getDb } from "@/lib/db";

/* ================= GET PROPERTIES ================= */
export async function GET() {
  try {
    const db = await getDb();

    const result = await db.request().query(`
      SELECT property_id, name, location
      FROM dbo.Properties
    `);

    console.log("PROPERTIES:", result.recordset);

    return NextResponse.json(result.recordset || []);

  } catch (err) {
    console.error("GET PROPERTIES ERROR:", err);
    return NextResponse.json([], { status: 500 }); // always return array
  }
}

/* ================= ADD PROPERTY ================= */
export async function POST(req: Request) {
  try {
    const { name, location } = await req.json();

    if (!name || !location) {
      return NextResponse.json(
        { message: "All fields required" },
        { status: 400 }
      );
    }

    const db = await getDb();

    await db.request()
      .input("name", sql.VarChar(100), name.trim())
      .input("location", sql.VarChar(100), location.trim())
      .query(`
        INSERT INTO dbo.Properties (name, location)
        VALUES (@name, @location)
      `);

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("ADD PROPERTY ERROR:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

/* ================= DELETE PROPERTY ================= */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "ID required" }, { status: 400 });
    }

    const db = await getDb();

    await db.request()
      .input("id", sql.Int, Number(id))
      .query(`
        DELETE FROM dbo.Properties
        WHERE property_id = @id
      `);

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("DELETE PROPERTY ERROR:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
