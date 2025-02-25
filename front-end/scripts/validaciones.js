// Función para validar que todos los campos del formulario estén llenos
export function validarCampos(titulo, editorial, autor, genero, isbn) {
  if (
    !titulo.trim() ||
    !editorial.trim() ||
    !autor.trim() ||
    !genero.trim() ||
    !isbn.trim()
  ) {
    alert("Todos los campos son obligatorios");
    return false;
  }
  return true;
}

// Función para limpiar los campos del formulario después de agregar
export function limpiarCampos() {
  document.getElementById("titulo").value = "";
  document.getElementById("editorial").value = "";
  document.getElementById("autor").value = "";
  document.getElementById("genero").value = "";
  document.getElementById("isbn").value = "";
}

// Verificar que el ISBN tenga exactamente 13 dígitos y sean numéricos
export function validarISBN(isbn) {
  const esNumerico = /^\d{13}$/.test(isbn);

  if (esNumerico) {
    return true;
  } else {
    alert("el campo ISBN debe de tener 13 digitos");
    document.getElementById("isbn").value = "";
    return false;
  }
}

// Función para limpiar los campos del formulario después de agregar
export function validarBusqueda(tituloBusqueda) {
  const titulo = tituloBusqueda.trim();
  if (titulo) {
    return true;
  } else {
    alert("introdusca el nombre del libro a buscar");
    return false;
  }
}

// Función informacion del libro
export function llenarFormulario(libro) {
  const libroData = libro[0]; // Si hay más de un libro, puedes manejar eso aquí
  document.getElementById("titulo").value = libroData.titulo || "";
  document.getElementById("editorial").value = libroData.editorial || "";
  document.getElementById("autor").value = libroData.autor || "";
  document.getElementById("genero").value = libroData.genero || "";
  document.getElementById("isbn").value = libroData.isbn || "";
}

// Muestra la tabla y la llena para el crud consulta
export function llenarTabla(libros) {
  const tabla = document.getElementById("resultado-tabla");
  const tbody = tabla.querySelector("tbody");
  tbody.innerHTML = "";

  if (libros && libros.length > 0) {
    tabla.style.display = "table";
    libros.forEach((libro) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${libro.titulo}</td>
        <td>${libro.editorial}</td>
        <td>${libro.autor}</td>
        <td>${libro.genero}</td>
        <td>${libro.isbn}</td>
      `;
      tbody.appendChild(fila);
    });
  } else {
    // Ocultar la tabla si no hay resultados
    tabla.style.display = "none";
  }
}