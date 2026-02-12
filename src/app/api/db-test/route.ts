import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    console.log("DB_SERVER VALUE >>>", process.env.DB_SERVER);

    const pool = await getDb();

    const result = await pool
      .request()
      .query("SELECT GETDATE() AS serverTime");

    return NextResponse.json({
      status: "connected",
      time: result.recordset[0].serverTime,
    });
  } catch (error: any) {
    console.error("DB TEST ERROR:", error);

    return NextResponse.json(
      {
        status: "failed",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
