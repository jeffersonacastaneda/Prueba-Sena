const express = require("express");
const router = express.Router();
const connection = require("../db"); // Importar la conexión desde db.js

//RUTAS CRUD

// Ruta para crear un nuevo libro
router.post("/agregar", (req, res) => {
  const { isbn, titulo, autor, editorial, genero } = req.body;
  const query =
    "INSERT INTO material_bibliografico (isbn, titulo, autor, editorial, genero) VALUES (?, ?, ?, ?, ?)";
  connection.execute(
    query,
    [isbn, titulo, autor, editorial, genero],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        message: "Libro creado exitosamente",
        libroId: results.insertId,
      });
    }
  );
});

// Ruta para buscar un libro por título
router.get("/buscar", (req, res) => {
  const { titulo } = req.query;
  console.log(`Buscando libro con título: ${titulo}`); // Verifica el título recibido

  const query =
    "SELECT * FROM material_bibliografico WHERE LOWER(titulo) = LOWER(?)";

  connection.execute(query, [titulo], (err, results) => {
    if (err) {
      console.error(`Error en la consulta: ${err.message}`);
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      console.log("No se encontró ningún libro.");
      return res.status(404).json({
        message: "No se encontró ningún libro con el título proporcionado.",
      });
    }
    console.log("Libro encontrado:", results);
    res.status(200).json(results);
  });
});

// Ruta para modificar un libro
router.put("/modificar/:isbn", (req, res) => {
  const { isbn } = req.params; // Obtener el ISBN del parámetro de la URL
  const { titulo, autor, editorial, genero } = req.body;

  const query = `
    UPDATE material_bibliografico 
    SET titulo = ?, autor = ?, editorial = ?, genero = ? 
    WHERE isbn = ?
  `;

  connection.execute(
    query,
    [titulo, autor, editorial, genero, isbn],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Verificar si se actualizó algún registro
      if (results.affectedRows > 0) {
        res.status(200).json({ message: "Libro modificado exitosamente" });
      } else {
        res.status(404).json({ message: "Libro no encontrado" });
      }
    }
  );
});

// Ruta para eliminar un libro
router.delete("/eliminar/:isbn", (req, res) => {
  const { isbn } = req.params;
  const query = "DELETE FROM material_bibliografico WHERE isbn = ?";

  connection.execute(query, [isbn], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }
    res.status(200).json({ message: "Libro eliminado exitosamente" });
  });
});

/*********************/

router.get("/buscar-invitado", (req, res) => {
  const { titulo, autor, genero } = req.query;

  let query =
    "SELECT titulo, autor, genero FROM material_bibliografico WHERE 1=1";
  const params = [];

  if (titulo) {
    query += " AND LOWER(titulo) = LOWER(?)";
    params.push(titulo);
  }
  if (autor) {
    query += " AND LOWER(autor) = LOWER(?)";
    params.push(autor);
  }
  if (genero) {
    query += " AND LOWER(genero) = LOWER(?)";
    params.push(genero);
  }

  connection.execute(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(404).json({ message: "No se encontró ningún libro." });
    res.status(200).json(results);
  });
});

// Ruta para agregar un nuevo préstamo
router.post("/agregarP", async (req, res) => {
  const {
    nombre,
    apellido,
    telefono,
    direccion,
    correo,
    isbn,
    fechaP,
    fechaD,
  } = req.body;

  try {
    console.log("Datos recibidos:", req.body);

    // Verificar si el libro existe
    const [bookResults] = await connection
      .promise()
      .execute(
        "SELECT id, disponibilidad FROM material_bibliografico WHERE isbn = ?",
        [isbn]
      );

    if (bookResults.length === 0) {
      return res.status(404).json({ message: "Libro no encontrado." });
    }

    const materialId = bookResults[0].id;
    const disponibilidad = bookResults[0].disponibilidad;

    if (disponibilidad === 0) {
      return res
        .status(400)
        .json({ message: "El libro no está disponible para préstamo." });
    }

    console.log("ID del material encontrado:", materialId);

    // Registrar el usuario directamente (sin verificar si existe)
    const [userInsertResult] = await connection
      .promise()
      .execute(
        "INSERT INTO usuario (nombres, apellidos, telefono, direccion, correo) VALUES (?, ?, ?, ?, ?)",
        [nombre, apellido, telefono, direccion, correo]
      );
    const userId = userInsertResult.insertId;
    console.log("Usuario registrado con ID:", userId);

    // Agregar préstamo
    await connection
      .promise()
      .execute(
        "INSERT INTO prestamo (usuario_id, material_id, fecha_prestamo, fecha_devolucion) VALUES (?, ?, ?, ?)",
        [userId, materialId, fechaP, fechaD]
      );
    console.log("Préstamo registrado correctamente.");

    // Actualizar disponibilidad del libro a 0 (no disponible)
    await connection
      .promise()
      .execute(
        "UPDATE material_bibliografico SET disponibilidad = 0 WHERE id = ?",
        [materialId]
      );
    console.log("Disponibilidad del material actualizada a 0.");

    res.status(201).json({ message: "Préstamo creado exitosamente" });
  } catch (error) {
    console.error("Error en la creación del préstamo:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//////////////////////////

// Ruta para devolver el material y eliminar el préstamo

router.post("/devolverP", async (req, res) => {
  const { isbn } = req.body; // Recibimos el ISBN del libro

  try {
    console.log("Datos recibidos:", req.body); // Log de los datos recibidos

    // Verificar si el libro existe usando el ISBN
    const [bookResults] = await connection
      .promise()
      .execute(
        "SELECT id, disponibilidad FROM material_bibliografico WHERE isbn = ?",
        [isbn]
      );
    console.log("Resultados de la búsqueda del libro:", bookResults); // Log para ver los resultados

    if (bookResults.length === 0) {
      return res.status(404).json({ message: "Libro no encontrado." });
    }

    const materialId = bookResults[0].id;
    const disponibilidad = bookResults[0].disponibilidad;

    // Verificar si el libro ya está disponible (caso en que no se pueda devolver)
    if (disponibilidad === 1) {
      return res.status(400).json({ message: "El libro ya está disponible." });
    }

    // Buscar el préstamo asociado con el material
    const [loanResults] = await connection
      .promise()
      .execute("SELECT id, usuario_id FROM prestamo WHERE material_id = ?", [
        materialId,
      ]);
    console.log("Resultados de la búsqueda del préstamo:", loanResults); // Log para ver los resultados

    if (loanResults.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontró préstamo para este libro." });
    }

    const loanId = loanResults[0].id;
    const userId = loanResults[0].usuario_id;

    // Eliminar el préstamo
    await connection
      .promise()
      .execute("DELETE FROM prestamo WHERE id = ?", [loanId]);
    console.log("Préstamo eliminado correctamente.");

    // Eliminar el usuario relacionado con el préstamo
    await connection
      .promise()
      .execute("DELETE FROM usuario WHERE id = ?", [userId]);
    console.log("Usuario eliminado correctamente.");

    // Actualizar disponibilidad del libro a 1 (disponible)
    await connection
      .promise()
      .execute(
        "UPDATE material_bibliografico SET disponibilidad = 1 WHERE id = ?",
        [materialId]
      );
    console.log("Disponibilidad del material actualizada a 1.");

    res.status(200).json({ message: "Material devuelto exitosamente." });
  } catch (error) {
    console.error("Error en la devolución del préstamo:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


router.get("/buscar-isbn", (req, res) => {
  const { isbn } = req.query;
  console.log(`Buscando material con ISBN: ${isbn}`); // Verifica el ISBN recibido

  const query =
    "SELECT * FROM material_bibliografico WHERE isbn = ?";

  connection.execute(query, [isbn], (err, results) => {
    if (err) {
      console.error(`Error en la consulta: ${err.message}`);
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      console.log("No se encontró ningún material bibliográfico.");
      return res.status(404).json({
        message: "No se encontró ningún material bibliográfico con el ISBN proporcionado.",
      });
    }

    console.log("Material bibliográfico encontrado:", results);
    res.status(200).json(results[0]); // Retorna el primer resultado
  });
});





module.exports = router;
