import { NextResponse } from "next/server";
import sql from "mssql";
import { getDb } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { property_id, document_type, image_base64 } = await req.json();

    const db = await getDb();

    await db.request()
      .input("property_id", sql.Int, property_id)
      .input("document_type", sql.VarChar(100), document_type)
      .input("image_base64", sql.NVarChar(sql.MAX), image_base64)
      .query(`
        INSERT INTO PropertyDocuments (property_id, document_type, image_base64)
        VALUES (@property_id, @document_type, @image_base64)
      `);

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
