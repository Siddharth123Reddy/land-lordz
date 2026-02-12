import { NextResponse } from "next/server";
import sql from "mssql";
import { getDb } from "@/lib/db";

/* ================= GET PROFILE ================= */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const farmerId = searchParams.get("farmerId");

    if (!farmerId) {
      return NextResponse.json({ error: "farmerId missing" }, { status: 400 });
    }

    const db = await getDb();

    const result = await db
      .request()
      .input("farmer_id", sql.Int, Number(farmerId))
      .query(`
        SELECT name, contact, gender, age, address, district, state, profile_pic
        FROM dbo.Farmers
        WHERE farmer_id = @farmer_id
      `);

    if (result.recordset.length === 0) {
      return NextResponse.json({ error: "Farmer not found" }, { status: 404 });
    }

    return NextResponse.json(result.recordset[0]);
  } catch (err) {
    console.error("PROFILE FETCH ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/* ================= SAVE PROFILE ================= */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const farmerId = formData.get("farmerId");
    const gender = formData.get("gender");
    const age = formData.get("age");
    const address = formData.get("address");
    const district = formData.get("district");
    const state = formData.get("state");

    if (!farmerId || !gender || !age || !address || !district || !state) {
      return NextResponse.json(
        { message: "All fields required" },
        { status: 400 }
      );
    }

    const db = await getDb();

    await db
      .request()
      .input("farmer_id", sql.Int, Number(farmerId))
      .input("gender", sql.VarChar(10), gender)
      .input("age", sql.Int, Number(age))
      .input("address", sql.VarChar(255), address)
      .input("district", sql.VarChar(100), district)
      .input("state", sql.VarChar(100), state)
      .query(`
        UPDATE dbo.Farmers
        SET gender=@gender,
            age=@age,
            address=@address,
            district=@district,
            state=@state,
            status=1
        WHERE farmer_id=@farmer_id
      `);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PROFILE SAVE ERROR:", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
