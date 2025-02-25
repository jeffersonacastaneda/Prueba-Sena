const express = require("express");
const path = require("path");
const librosRoutes = require("./routes/route"); // Importamos las rutas CRUD
const app = express();
const PORT = 3001;

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, "../front-end")));

// Middleware para parsear JSON
app.use(express.json());

// Montar las rutas CRUD bajo el prefijo "/libros"
app.use("/libros", librosRoutes);

// Ruta para servir la página principal
app.get("/inicio", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../front-end/formulario_inicio_sesion.html")
  );
});

// Ruta para el módulo administrador
app.get("/administrador", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../front-end/formulario_administrador1.html")
  );
});

// Ruta para el módulo gestión de préstamos
app.get("/gprestamos", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../front-end/formulario_administrador2.html")
  );
});

// Ruta para el módulo gestión de material
app.get("/gmaterial", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../front-end/formulario_administrador3.html")
  );
});

// Ruta para el módulo gestión de reportes
app.get("/greportes", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../front-end/formulario_administrador4.html")
  );
});

// Ruta para el módulo invitado
app.get("/invitado", (req, res) => {
  res.sendFile(path.join(__dirname, "../front-end/formulario_invitado.html"));
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
