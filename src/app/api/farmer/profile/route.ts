import { NextResponse } from "next/server";
import sql from "mssql";
import { getDb } from "@/lib/db";

/* =========================
   GET PROFILE
========================= */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const farmerId = searchParams.get("farmerId");

    if (!farmerId) {
      return NextResponse.json(
        { error: "farmerId missing" },
        { status: 400 }
      );
    }

    const db = await getDb();

    const result = await db
      .request()
      .input("farmer_id", sql.Int, Number(farmerId))
      .query(`
        SELECT 
          farmer_id,
          name,
          contact,
          gender,
          age,
          address,
          district,
          state,
          profile_pic
        FROM dbo.Farmers
        WHERE farmer_id = @farmer_id
      `);

    if (result.recordset.length === 0) {
      return NextResponse.json(
        { error: "Farmer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.recordset[0]);

  } catch (err) {
    console.error("PROFILE FETCH ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}


/* =========================
   UPDATE PROFILE
========================= */
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const {
      farmerId,
      gender,
      age,
      address,
      district
    } = body;

    if (!farmerId) {
      return NextResponse.json(
        { error: "farmerId missing" },
        { status: 400 }
      );
    }

    const db = await getDb();

    await db
      .request()
      .input("farmer_id", sql.Int, Number(farmerId))
      .input("gender", sql.VarChar(50), gender)
      .input("age", sql.Int, Number(age))
      .input("address", sql.VarChar(255), address)
      .input("district", sql.VarChar(100), district)
      .query(`
        UPDATE dbo.Farmers
        SET 
          gender = @gender,
          age = @age,
          address = @address,
          district = @district
        WHERE farmer_id = @farmer_id
      `);

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("PROFILE UPDATE ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
