import { NextResponse } from "next/server";
import sql from "mssql";
import { getDb } from "@/lib/db";

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const property_id = searchParams.get("property_id");

    if (!property_id) {
      return NextResponse.json(
        { error: "property_id is required" },
        { status: 400 }
      );
    }

    const pool = await getDb();

    // Delete documents first
    await pool
      .request()
      .input("property_id", sql.Int, Number(property_id))
      .query(`
        DELETE FROM PropertyDocuments
        WHERE property_id = @property_id
      `);

    // Delete property
    await pool
      .request()
      .input("property_id", sql.Int, Number(property_id))
      .query(`
        DELETE FROM Properties
        WHERE property_id = @property_id
      `);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Property Error:", error);
    return NextResponse.json(
      { error: "Failed to delete property" },
      { status: 500 }
    );
  }
}
