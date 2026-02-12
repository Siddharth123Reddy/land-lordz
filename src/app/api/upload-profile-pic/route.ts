import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import sql from "mssql";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    console.log("✅ HIT /api/upload-profile-pic");

    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const farmerIdRaw = formData.get("farmerId") as string | null;

    if (!file || !farmerIdRaw) {
      return NextResponse.json(
        { message: "Missing file or farmerId" },
        { status: 400 }
      );
    }

    const farmerId = Number(farmerIdRaw);

    if (isNaN(farmerId)) {
      return NextResponse.json(
        { message: "Invalid farmerId" },
        { status: 400 }
      );
    }

    /* ---------- Validate File Type ---------- */
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "Only JPG, PNG, WEBP allowed" },
        { status: 400 }
      );
    }

    /* ---------- Convert to Buffer ---------- */
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    /* ---------- Create Upload Directory ---------- */
    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "profile-pics"
    );

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    /* ---------- Determine File Extension ---------- */
    const ext = file.name.split(".").pop();
    const fileName = `${farmerId}.${ext}`;
    const filePath = path.join(uploadDir, fileName);

    /* ---------- Delete Old File (If Exists) ---------- */
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    /* ---------- Save File ---------- */
    fs.writeFileSync(filePath, buffer);

    /* ---------- Update Database ---------- */
    const db = await getDb();
    const imagePath = `/uploads/profile-pics/${fileName}`;

    await db
      .request()
      .input("farmer_id", sql.Int, farmerId)
      .input("profile_pic", sql.NVarChar(255), imagePath)
      .query(`
        UPDATE dbo.Farmers
        SET profile_pic = @profile_pic
        WHERE farmer_id = @farmer_id
      `);

    return NextResponse.json({
      success: true,
      profile_pic: imagePath,
    });

  } catch (err) {
    console.error("❌ UPLOAD PROFILE PIC ERROR >>>", err);

    return NextResponse.json(
      { success: false, message: "Server error while uploading profile picture" },
      { status: 500 }
    );
  }
}
