import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import sql from "mssql";

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const {
      property_id,
      property_name,
      property_type,
      location,
      geo_location,
      property_image,
      documents,
    } = body;

    const pool = await getDb();

    await pool
      .request()
      .input("property_id", sql.Int, property_id)
      .input("property_name", sql.VarChar, property_name)
      .input("property_type", sql.VarChar, property_type)
      .input("location", sql.VarChar, location)
      .input("geo_location", sql.VarChar, geo_location)
      .input("property_image", sql.NVarChar(sql.MAX), property_image)
      .query(`
        UPDATE Properties
        SET property_name = @property_name,
            property_type = @property_type,
            location = @location,
            geo_location = @geo_location,
            property_image = @property_image
        WHERE property_id = @property_id
      `);

    // delete old docs
    await pool
      .request()
      .input("property_id", sql.Int, property_id)
      .query(`DELETE FROM PropertyDocuments WHERE property_id = @property_id`);

    // insert new docs
    if (documents && documents.length > 0) {
      for (const doc of documents) {
        if (!doc.file_base64) continue;

        await pool
          .request()
          .input("property_id", sql.Int, property_id)
          .input("document_type", sql.VarChar, doc.documentType)
          .input("file_base64", sql.NVarChar(sql.MAX), doc.file_base64)
          .query(`
            INSERT INTO PropertyDocuments
            (property_id, document_type, file_base64)
            VALUES
            (@property_id, @document_type, @file_base64)
          `);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
