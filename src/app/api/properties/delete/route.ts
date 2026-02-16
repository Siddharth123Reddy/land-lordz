import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import sql from "mssql";

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const pool = await getDb();

    await pool
      .request()
      .input("id", sql.Int, Number(id))
      .query("DELETE FROM PropertyDocuments WHERE property_id = @id");

    await pool
      .request()
      .input("id", sql.Int, Number(id))
      .query("DELETE FROM Properties WHERE property_id = @id");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
