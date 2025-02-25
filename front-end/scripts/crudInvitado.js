import {
  limpiarCamposInvitado,
  validarBusquedaInvitado,
  llenarTablaInvitado,
} from "./validacionesInvitado.js";

document
  .getElementById("btn-invitado")
  .addEventListener("click", function (event) {
    // Evita el envío automático del formulario
    event.preventDefault();
    
    const titulo = document.getElementById("titulo").value;
    const autor = document.getElementById("autor").value;
    const genero = document.getElementById("genero").value;

    const isValid = validarBusquedaInvitado(titulo, autor, genero);
    if (isValid)  {
// Construye la URL de la petición según los campos no vacíos
let queryParams = [];
if (titulo) queryParams.push(`titulo=${encodeURIComponent(titulo)}`);
if (autor) queryParams.push(`autor=${encodeURIComponent(autor)}`);
if (genero) queryParams.push(`genero=${encodeURIComponent(genero)}`);
const queryString = queryParams.join('&');

// Realizamos la petición a la nueva ruta '/libros/buscar-invitado'
fetch(`/libros/buscar-invitado?${queryString}`, {
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
    
    // Llenar la tabla con la información del libro
    llenarTablaInvitado(data); 
    limpiarCamposInvitado();
  })
  .catch((error) => {
    // alert("No se encontró ningún libasasasro con los criterios especificados.");
    
  });


    }
    
  });