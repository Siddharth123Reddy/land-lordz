import { NextResponse } from "next/server";
import sql from "mssql";
import { getDb } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { contact, password } = await req.json();

    if (!contact || !password) {
      return NextResponse.json(
        { message: "Contact and password required" },
        { status: 400 }
      );
    }

    const db = await getDb();

    const result = await db
      .request()
      .input("contact", sql.VarChar(50), contact.trim().toLowerCase())
      .query(`
        SELECT farmer_id, name, password_hash, status
        FROM dbo.Farmers
        WHERE LOWER(LTRIM(RTRIM(contact))) = @contact
      `);

    if (result.recordset.length === 0) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const farmer = result.recordset[0];
    const match = await bcrypt.compare(password, farmer.password_hash);

    if (!match) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    if (farmer.status === 2) {
      return NextResponse.json({
        message: "Complete profile first",
        farmerId: farmer.farmer_id,
      });
    }
    

    return NextResponse.json({
      success: true,
      farmerId: farmer.farmer_id,
      name: farmer.name,
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
