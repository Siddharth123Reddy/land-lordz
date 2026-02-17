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
          pincode,
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

    const farmerId = Number(body.farmerId);

    if (!farmerId) {
      return NextResponse.json(
        { error: "farmerId missing" },
        { status: 400 }
      );
    }

    const db = await getDb();

    await db.request()
      .input("farmer_id", sql.Int, farmerId)
      .input("name", sql.VarChar(150), body.name || null) // ✅ ADDED
      .input("gender", sql.VarChar(50), body.gender || null)
      .input("age", sql.Int, body.age ? Number(body.age) : null)
      .input("address", sql.VarChar(255), body.address || null)
      .input("district", sql.VarChar(100), body.district || null)
      .input("state", sql.VarChar(100), body.state || null)
      .input("pincode", sql.VarChar(10), body.pincode || null)
      .query(`
        UPDATE dbo.Farmers
        SET 
          name = @name,              -- ✅ ADDED
          gender = @gender,
          age = @age,
          address = @address,
          district = @district,
          state = @state,
          pincode = @pincode
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
