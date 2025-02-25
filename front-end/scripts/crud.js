import {
  validarCampos,
  limpiarCampos,
  validarISBN,
  validarBusqueda,
  llenarTabla,
} from "./validaciones.js";




// gestion de material CRUD

// AGREGAR
document
  .getElementById("btn-agregar")
  .addEventListener("click", function (event) {
    // Evita el envío automático del formulario
    event.preventDefault();

    // Captura de los datos utilizando los ID de cada campo
    const titulo = document.getElementById("titulo").value;
    const editorial = document.getElementById("editorial").value;
    const autor = document.getElementById("autor").value;
    const genero = document.getElementById("genero").value;
    const isbn = document.getElementById("isbn").value;

    // Validación de campos (puedes definir la función validarCampos si no la tienes)
    const isValid = validarCampos(titulo, editorial, autor, genero, isbn);
    const isIsbn = validarISBN(isbn);
    // Si todos los campos son válidos, se envía la solicitud al servidor
    if (isValid && isIsbn) {
      fetch("/libros/agregar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({
          titulo: titulo,
          editorial: editorial,
          autor: autor,
          genero: genero,
          isbn: isbn,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Éxito:", data);
          limpiarCampos();
        })
        .catch((error) => {
          console.error("Error:", error.message);
        });
    }
  });

//BUSCAR

document
  .getElementById("btn-buscar")
  .addEventListener("click", function (event) {
    // Evita el envío automático del formulario
    event.preventDefault();
    const titulo = document.getElementById("titulo").value;

    const isTitle = validarBusqueda(titulo);

    if (isTitle) {
      fetch(`/libros/buscar?titulo=${encodeURIComponent(titulo)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Éxito:", data);
          llenarTabla(data); // Llenar la tabla con la información del primer libro
        })
        .catch((error) => {
          alert("no se encontro ningun libaro con ese nombre");
          limpiarCampos();
        });
    }
  });

//MODIFICAR

document
  .getElementById("btn-modificar")
  .addEventListener("click", function (event) {
    // Evita el envío automático del formulario
    event.preventDefault();

    // Muestra una ventana de confirmación
    const confirmar = confirm(
      "¿Está seguro que desea realizar la modificación?"
    );

    if (confirmar) {
      // Si el usuario hace clic en "Aceptar", continúa con la solicitud

      // Obtén los valores de los campos del formulario
      const isbn = document.getElementById("isbn").value;
      const titulo = document.getElementById("titulo").value;
      const autor = document.getElementById("autor").value;
      const editorial = document.getElementById("editorial").value;
      const genero = document.getElementById("genero").value;

      // Verifica que el ISBN esté lleno para la solicitud
      if (!isbn) {
        alert("El campo ISBN es obligatorio para modificar un libro.");
        return;
      }

      // Prepara los datos para enviar en el cuerpo de la solicitud
      const libroData = {
        isbn: isbn, // Incluye el ISBN en los datos enviados
        titulo: titulo,
        autor: autor,
        editorial: editorial,
        genero: genero,
      };

      // Envía la solicitud PUT al servidor
      fetch(`/libros/modificar/${encodeURIComponent(isbn)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(libroData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          alert(data.message);
          limpiarCampos();
        })
        .catch((error) => {
          alert(
            "Error al modificar el libro: el ISBN del libro no debe de cambiar. "
          );
        });
    }
  });

//ELIMINAR

document
  .getElementById("btn-eliminar")
  .addEventListener("click", function (event) {
    // Evita el envío automático del formulario
    event.preventDefault();

    // Muestra una ventana de confirmación
    const confirmar = confirm("¿Está seguro que desea eliminar el libro?");

    if (confirmar) {
      // Si el usuario hace clic en "Aceptar", continúa con la solicitud

      // Obtén el valor del campo ISBN
      const isbn = document.getElementById("isbn").value;

      // Verifica que el ISBN esté lleno para la solicitud
      if (!isbn) {
        alert("El campo ISBN es obligatorio para eliminar el libro.");
        return;
      }

      // Envía la solicitud DELETE al servidor
      fetch(`/libros/eliminar/${encodeURIComponent(isbn)}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          alert(data.message);
          limpiarCampos(); // Llama a la función para limpiar los campos
        })
        .catch((error) => {
          alert("Error al eliminar el libro: " + error.message);
        });
    }
  });


  ////////****************************** */

  