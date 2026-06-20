require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3001;

// Conexión a Supabase PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ─── GET /api/clientes ───────────────────────────────────────────────────────
// Retorna todos los usuarios con role = 'customer'
app.get("/api/clientes", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        user_id    AS "userId",
        name       AS "nombre",
        email,
        phone      AS "telefono",
        role       AS "rol",
        created_at AS "fechaRegistro"
      FROM users
      WHERE role = 'customer'
      ORDER BY created_at DESC
    `);
    res.json({ ok: true, total: result.rowCount, data: result.rows });
  } catch (error) {
    console.error("[ERROR /api/clientes]", error.message);
    res.status(500).json({ ok: false, message: "Error al consultar la base de datos", detail: error.message });
  }
});

// ─── GET /api/stats ──────────────────────────────────────────────────────────
// Estadísticas rápidas para el encabezado del reporte
app.get("/api/stats", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*)                                                        AS total,
        COUNT(*) FILTER (WHERE created_at >= date_trunc('month', NOW())) AS nuevos_este_mes,
        COUNT(*) FILTER (WHERE phone IS NOT NULL)                       AS con_telefono
      FROM users
      WHERE role = 'customer'
    `);
    res.json({ ok: true, data: result.rows[0] });
  } catch (error) {
    console.error("[ERROR /api/stats]", error.message);
    res.status(500).json({ ok: false, message: "Error al consultar estadísticas" });
  }
});

// Sirve el index.html para cualquier ruta no reconocida
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`   → API clientes: http://localhost:${PORT}/api/clientes`);
  console.log(`   → Reporte:      http://localhost:${PORT}`);
});
