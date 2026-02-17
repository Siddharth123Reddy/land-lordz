import { NextResponse } from "next/server";
import sql from "mssql";
import { getDb } from "@/lib/db";
import { hashPassword } from "@/lib/hash";

export async function POST(req: Request) {
  try {
    const db = await getDb();
    const body = await req.json();

    const {
      name,
      contact,
      password,
      age,
      gender,
      address,
      pincode,
      district,
      state,
      profile_pic,   // ✅ ADD THIS
    } = body;

    if (!name || !contact || !password) {
      return NextResponse.json(
        { message: "Name, contact and password are required" },
        { status: 400 }
      );
    }

    const trimmedContact = contact.trim().toLowerCase();
    const passwordHash = await hashPassword(password);

    // Check duplicate
    const exists = await db
      .request()
      .input("contact", sql.NVarChar(100), trimmedContact)
      .query(`
        SELECT farmer_id
        FROM dbo.Farmers
        WHERE LOWER(LTRIM(RTRIM(contact))) = @contact
      `);

    if (exists.recordset.length > 0) {
      return NextResponse.json(
        { message: "Account already exists" },
        { status: 409 }
      );
    }

    // ✅ INSERT INCLUDING profile_pic
    const result = await db
      .request()
      .input("name", sql.NVarChar(100), name)
      .input("contact", sql.NVarChar(100), trimmedContact)
      .input("password_hash", sql.NVarChar(255), passwordHash)
      .input("age", sql.Int, age || null)
      .input("gender", sql.NVarChar(50), gender || null)
      .input("address", sql.NVarChar(255), address || null)
       .input("pincode", sql.VarChar(10), pincode || null)
      .input("district", sql.NVarChar(100), district || null)
      .input("state", sql.NVarChar(100), state || null)
      .input("profile_pic", sql.NVarChar(sql.MAX), profile_pic || null) // ✅ IMPORTANT
      .input("status", sql.Int, 1)
      .query(`
        INSERT INTO dbo.Farmers 
        (name, contact, password_hash, age, gender, address, district, state, profile_pic, status)
        OUTPUT INSERTED.farmer_id
        VALUES 
        (@name, @contact, @password_hash, @age, @gender, @address, @district, @state, @profile_pic, @status)
      `);

    return NextResponse.json({
      farmerId: result.recordset[0].farmer_id,
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
