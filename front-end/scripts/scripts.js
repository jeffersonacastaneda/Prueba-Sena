

// INICIO DE SESION
// INICIO INVITADO

document.addEventListener("DOMContentLoaded", function () {
  //
  const inicioSesionButton = document.getElementById("inicioSesion");
  const invitadoButton = document.getElementById("invitado");

 
  if(inicioSesionButton){

    inicioSesionButton.addEventListener("click", function (event) {
      event.preventDefault();
      const usuario = document.getElementById("usuario").value;
      const password = document.getElementById("password").value;
  
      if (usuario === "ADMIN" && password === "ADMIN123") {
        window.location.href = "/administrador";
      } else {
        alert("Usuario o contraseña incorrectos");
      }
    });
  }
  
 
  if(invitadoButton){
  
  invitadoButton.addEventListener("click", function () {
    window.location.href = "/invitado";
  });
  
  }

});


// PAGINA GESTION PRESTAMOS
// PAGINA GESTION DE MATERIALES
// PAGINA GESTION REPORTES

document.addEventListener("DOMContentLoaded", function () {
  
  const gprestamo = document.getElementById("gestionarPrestamo");
  const gmaterial = document.getElementById("gestionarMaterial");
  const greportes = document.getElementById("gestionarReportes");

  

  if(gprestamo){

 gprestamo.addEventListener("click", function (event) {
  event.preventDefault();
  window.location.href = "/gprestamos";
 });

  }
 
  if(gmaterial){

   gmaterial.addEventListener("click", function () {
    // Redirigir a la página especificada
    window.location.href = "/gmaterial";
  });
   
    }
     
  if(greportes){

  greportes.addEventListener("click", function () {
  // Redirigir a la página especificada
  window.location.href = "/greportes";
});

}
 
});
