import { NextResponse } from "next/server";
import sql from "mssql";
import fs from "fs";
import path from "path";
import { getDb } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("document") as File | null;
    const farmerId = formData.get("farmerId") as string | null;

    if (!file || !farmerId) {
      return NextResponse.json(
        { message: "File or farmerId missing" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "documents"
    );

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `land_${farmerId}_${Date.now()}.pdf`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, buffer);

    const documentPath = `/uploads/documents/${fileName}`;

    const db = await getDb();

    // 🔥 INSERT INTO land_documents TABLE
    await db.request()
      .input("farmer_id", sql.Int, Number(farmerId))
      .input("document_path", sql.NVarChar(255), documentPath)
      .query(`
        INSERT INTO dbo.land_documents (farmer_id, document_path)
        VALUES (@farmer_id, @document_path)
      `);

    return NextResponse.json({
      message: "Document uploaded successfully",
      path: documentPath,
    });

  } catch (err) {
    console.error("DOCUMENT UPLOAD ERROR:", err);

    return NextResponse.json(
      { message: "Server error while uploading document" },
      { status: 500 }
    );
  }
}
