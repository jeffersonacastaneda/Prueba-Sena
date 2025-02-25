document
  .getElementById("btn-prestar")
  .addEventListener("click", function (event) {
    // Evita el envío automático del formulario
    event.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const telefono = document.getElementById("telefono").value;
    const direccion = document.getElementById("direccion").value;
    const correo = document.getElementById("email").value;
    const isbn = document.getElementById("isbn").value;
    const fechaPrestamo = document.getElementById("fecha_prestamo").value;
    const fechaDevolucion = document.getElementById("fecha_devolucion").value;

    // Validar el ISBN antes de continuar
    if (!validarISBN(isbn)) {
      return; // Si el ISBN no es válido, no continuar con el préstamo
    }

    // Construir la URL para la petición
    const requestData = {
      nombre,
      apellido,
      telefono,
      direccion,
      correo,
      isbn,
      fechaP: fechaPrestamo,
      fechaD: fechaDevolucion,
    };

    // Enviar la solicitud de préstamo
    fetch("/libros/agregarP", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Préstamo agregado exitosamente:", data);
        // Mostrar alerta solo después de un préstamo exitoso
        alert("Préstamo agregado exitosamente.");
        // Limpiar los campos del formulario
        limpiarCamposPrestamos();
      })
      .catch((error) => {
        console.error("Error al agregar el préstamo:", error);
        // Aquí puedes manejar el error, como mostrar un mensaje de error
        alert("Ocurrió un error al agregar el préstamo. Libro no disponible.");
        limpiarCamposPrestamos();
      });
  });

// Función para limpiar los campos del formulario
export function limpiarCamposPrestamos() {
  document.getElementById("nombre").value = "";
  document.getElementById("apellido").value = "";
  document.getElementById("telefono").value = "";
  document.getElementById("direccion").value = "";
  document.getElementById("email").value = "";
  document.getElementById("isbn").value = "";
  document.getElementById("fecha_prestamo").value = "";
  document.getElementById("fecha_devolucion").value = "";
}

// Verificar que el ISBN tenga exactamente 13 dígitos y sean numéricos
export function validarISBN(isbn) {
  const esNumerico = /^\d{13}$/.test(isbn);

  if (!esNumerico) {
    alert("El campo ISBN debe tener 13 dígitos numéricos.");
    document.getElementById("isbn").value = ""; // Limpiar el campo ISBN
  }

  return esNumerico;
}

// Verificar si los campos obligatorios están llenos
function validarCampos(
  nombre,
  apellido,
  telefono,
  direccion,
  correo,
  isbn,
  fechaPrestamo,
  fechaDevolucion
) {
  if (
    !nombre ||
    !apellido ||
    !telefono ||
    !direccion ||
    !correo ||
    !isbn ||
    !fechaPrestamo ||
    !fechaDevolucion
  ) {
    alert("Por favor, complete todos los campos.");
    return false;
  }
  return true;
}

///////////// devolver material

document
  .getElementById("btn-devolver")
  .addEventListener("click", function (event) {
    // Evita el envío automático del formulario
    event.preventDefault();

    const isbn = document.getElementById("isbn").value; // Solo necesitamos el ISBN para la devolución

    // Validar el ISBN antes de continuar
    if (!validarISBN(isbn)) {
      return; // Si el ISBN no es válido, no continuar con la devolución
    }

    // Construir la URL para la petición
    const requestData = {
      isbn, // Solo el ISBN es necesario para devolver el material
    };

    // Enviar la solicitud para devolver el material
    fetch("/libros/devolverP", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Material devuelto exitosamente:", data);
        // Mostrar alerta solo después de una devolución exitosa
        alert("Material devuelto exitosamente.");
        // Limpiar los campos del formulario
        limpiarCamposDevolucion();
      })
      .catch((error) => {
        console.error("Error al devolver el material:", error);
        // Aquí puedes manejar el error, como mostrar un mensaje de error
        alert("Ocurrió un error al devolver el material. Intenta nuevamente.");
      });
  });

// Función para limpiar los campos del formulario de devolución
function limpiarCamposDevolucion() {
  document.getElementById("isbn").value = ""; // Limpiar el campo ISBN
}

// Función para manejar la disponibilidad
function mostrarDisponibilidad(disponibilidad) {
  return disponibilidad === 1 ? "Sí" : "No";
}

// Evento para manejar la búsqueda por ISBN
document
  .getElementById("btn-buscar-isbn")
  .addEventListener("click", (event) => {
    event.preventDefault();
    const isbn = document.getElementById("isbn").value;

    // Validar ISBN antes de realizar la búsqueda
    if (!validarISBN(isbn)) {
      return; // Detener ejecución si el ISBN no es válido
    }

    fetch(`/libros/buscar-isbn?isbn=${isbn}`)
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Material no encontrado.");
          }
          throw new Error("Error al buscar el material.");
        }
        return response.json();
      })
      .then((material) => {
        // Actualiza el campo de texto para mostrar la disponibilidad
        const disponibilidadTexto = mostrarDisponibilidad(
          material.disponibilidad
        );
        document.getElementById("disponibilidad").value = disponibilidadTexto;
      })
      .catch((error) => {
        document.getElementById("disponibilidad").value =
          "Error: " + error.message;
      });
  });

/** 

// Función para manejar la disponibilidad
function mostrarDisponibilidad(disponibilidad) {
  return disponibilidad === 1 ? "Sí" : "No";
}









// Evento para manejar la búsqueda por ISBN
document
  .getElementById("btn-buscar-isbn")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const isbn = document.getElementById("isbn").value;
    validarISBN(isbn);

    // if (!isbn) {
    //  alert("Por favor, ingresa un ISBN.");
    //  return;
    //}

    fetch(`/libros/buscar-isbn?isbn=${isbn}`)
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Material no encontrado.");
          }
          throw new Error("Error al buscar el material.");
        }
        return response.json();
      })
      .then((material) => {
        // Actualiza el campo de texto para mostrar la disponibilidad
        const disponibilidadTexto = mostrarDisponibilidad(
          material.disponibilidad
        );
        document.getElementById("disponibilidad").value = disponibilidadTexto;
      })
      .catch((error) => {
        document.getElementById("disponibilidad").value =
          "Error: " + error.message;
      });
  });
*/
