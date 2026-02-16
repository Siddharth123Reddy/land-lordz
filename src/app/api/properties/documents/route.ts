import { NextResponse } from "next/server";
import sql from "mssql";
import { getDb } from "@/lib/db";

/* ===============================
   GET - Get Document By Property
================================= */

export async function GET(req: Request) {
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

    const result = await pool.request()
      .input("property_id", sql.Int, property_id)
      .query(`
        SELECT *
        FROM PropertyDocuments
        WHERE property_id = @property_id
        ORDER BY uploaded_at DESC
      `);

    return NextResponse.json(result.recordset);

  } catch (error) {
    console.error("Get Document Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch document" },
      { status: 500 }
    );
  }
}

/* ===============================
   POST - Upload Document
================================= */

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      property_id,
      document_type,
      file_base64
    } = body;

    const pool = await getDb();

    await pool.request()
      .input("property_id", sql.Int, property_id)
      .input("document_type", sql.VarChar(150), document_type)
      .input("file_base64", sql.NVarChar(sql.MAX), file_base64)
      .query(`
        INSERT INTO PropertyDocuments
        (property_id, document_type, file_base64, uploaded_at)
        VALUES
        (@property_id, @document_type, @file_base64, GETDATE())
      `);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Upload Document Error:", error);
    return NextResponse.json(
      { error: "Failed to upload document" },
      { status: 500 }
    );
  }
}
