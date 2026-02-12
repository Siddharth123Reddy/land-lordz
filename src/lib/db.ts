import sql from "mssql";

const config: sql.config = {
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  server: process.env.DB_SERVER!,
  database: process.env.DB_DATABASE!,
  port: Number(process.env.DB_PORT),
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

let pool: sql.ConnectionPool | null = null;

export async function getDb() {
  try {
    if (!pool) {
      pool = await sql.connect(config);
      console.log("✅ SQL Server connected");
    }
    return pool;
  } catch (error) {
    console.error("❌ SQL Server connection error:", error);
    throw error;
  }
}
