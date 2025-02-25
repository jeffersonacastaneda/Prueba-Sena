

document.addEventListener("DOMContentLoaded", function() {
  //
  const inicioSesionForm = document.getElementById("inicioSesion");
  const invitadoButton = document.getElementById("invitado");

  // INICIO DE SESION
  
      inicioSesionForm.addEventListener("submit", function(event) {
          event.preventDefault(); // Prevenir el envío del formulario

          
          const usuario = document.getElementById("usuario").value;
          const password = document.getElementById("password").value;

          
          if (usuario === "ADMIN" && password === "ADMIN123") {
             
              window.location.href = "../front-end/formulario_administrador1.html";
          } else {
           
              alert("Usuario o contraseña incorrectos");
          }
      });
  

  // INICIO INVITADO
 
      invitadoButton.addEventListener("click", function() {
          // Redirigir al usuario a la página de invitado
          window.location.href = "../front-end/formulario_invitado.html";
      });
 
});



document.addEventListener("DOMContentLoaded", function() {
 
  const gprestamo = document.getElementById("gestionarPrestamo");
  const gmaterial = document.getElementById("gestionarMaterial");
  const greportes = document.getElementById("gestionarReportes");

  // PAGINA GESTION PRESTAMOS
  
      gprestamo.addEventListener("click", function() {
          // Redirigir a la página especificada
          window.location.href = "../front-end/formulario_administrador2.html" 
      });
 

  // PAGINA GESTION DE MATERIALES
 
      gmaterial.addEventListener("click", function() {
          // Redirigir a la página especificada
          window.location.href = "../front-end/formulario_administrador3.html"; 
      });
 

    // PAGINA GESTION REPORTES

      greportes.addEventListener("click", function() {
          // Redirigir a la página especificada
          window.location.href = "../front-end/formulario_administrador2.html"; 
      });

});