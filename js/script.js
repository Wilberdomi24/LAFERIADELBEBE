 
    function toggleSidebar() {
      const sidebar = document.getElementById("mySidebar");
      const main = document.getElementById("main");
      const body = document.body;

      if (sidebar.style.left === "0px") {
        sidebar.style.left = "-250px";
        main.style.marginLeft = "0";
        body.classList.remove("sidebar-open");
      } else {
        sidebar.style.left = "0px";
        main.style.marginLeft = "250px";
        body.classList.add("sidebar-open");
      }
  }
      let currentSlide = 0;
      const slides = document.querySelectorAll(".carousel-image");

      function showSlide(index) {
        slides.forEach((slide, i) => {
          slide.classList.remove("active");
        });
        slides[index].classList.add("active");
      }

      function changeSlide(direction) {
        currentSlide += direction;
        if (currentSlide < 0) currentSlide = slides.length - 1;
        if (currentSlide >= slides.length) currentSlide = 0;
        showSlide(currentSlide);
      }

  // Mostrar el primer slide al cargar
  showSlide(currentSlide);

   const sidebarStickyTitle = document.getElementById('sidebarStickyTitle');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 150) {
      sidebarStickyTitle.style.display = 'block';
    } else {
      sidebarStickyTitle.style.display = 'none';
    }
  });




  function getPreciseLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async function (position) {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          // Consulta a la API de ubicación invertida
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
          const data = await response.json();

          // Mostrar en pantalla
          const locationDiv = document.getElementById("location-display");
          locationDiv.textContent = ` ${data.address.city || data.address.town || data.address.village}, ${data.address.state}`;
        },
        function (error) {
          document.getElementById("location-display").textContent =
            "⚠️ Error al obtener ubicación.";
          console.error("Error de geolocalización:", error);
        },
        {
          enableHighAccuracy: true, // 👈 ACTIVAMOS ALTA PRECISIÓN
          timeout: 10000,            // Espera máximo 10 segundos
          maximumAge: 0              // Nada de caché, ubicación 100% en vivo
        }
      );
    } else {
      document.getElementById("location-display").textContent =
        "❌ Geolocalización no disponible.";
    }
  }

  window.onload = getPreciseLocation;



  window.addEventListener('scroll', function () {
    const logo = document.querySelector('.logo-container');
    if (window.scrollY > 50) {
      logo.classList.add('visible');
    } else {
      logo.classList.remove('visible');
    }
  });



  // Al hacer clic en una categoría
  document.querySelectorAll(".baby-category").forEach(categoria => {
    categoria.addEventListener("click", () => {
      // Eliminar clase activa de todas las categorías
      document.querySelectorAll(".baby-category").forEach(cat => {
        cat.classList.remove("active");
      });

      // Agregar clase activa a la clicada
      categoria.classList.add("active");

      // Obtener su categoría
      const categoriaSeleccionada = categoria.getAttribute("data-categoria");

      // Mostrar solo los productos de esa categoría
      document.querySelectorAll(".product-card").forEach(producto => {
        const categoriaProducto = producto.getAttribute("data-categoria");
        if (categoriaProducto === categoriaSeleccionada) {
          producto.style.display = "block";
        } else {
          producto.style.display = "none";
        }
      });
    });
  });









  function mostrarFormulario(tipo) {
    document.getElementById("form-login").style.display = tipo === "login" ? "block" : "none";
    document.getElementById("form-register").style.display = tipo === "register" ? "block" : "none";
    document.getElementById("btn-login").classList.toggle("active", tipo === "login");
    document.getElementById("btn-register").classList.toggle("active", tipo === "register");
  }

  function abrirModalAuth() {
    document.getElementById("modal-auth").style.display = "block";
  }

  function cerrarModalAuth() {
    document.getElementById("modal-auth").style.display = "none";
  }

  // Registrar
  document.getElementById("form-register").addEventListener("submit", function(e) {
    e.preventDefault();
    const user = document.getElementById("register-usuario").value;
    const email = document.getElementById("register-correo").value;
    const pass = document.getElementById("register-clave").value;

    localStorage.setItem("usuario", user);
    localStorage.setItem("correo", email);
    localStorage.setItem("clave", pass);
    localStorage.setItem("usuarioLogueado", "true");

    cerrarModalAuth();
    mostrarMensaje(`🎉 Bienvenido, ${user}`);
  });

  // Login
  document.getElementById("form-login").addEventListener("submit", function(e) {
    e.preventDefault();
    const user = document.getElementById("login-usuario").value;
    const pass = document.getElementById("login-clave").value;

    const savedUser = localStorage.getItem("usuario");
    const savedPass = localStorage.getItem("clave");

    if (user === savedUser && pass === savedPass) {
      localStorage.setItem("usuarioLogueado", "true");
      cerrarModalAuth();
      mostrarMensaje("🔓 Sesión iniciada correctamente");
    } else {
      mostrarMensaje("❌ Usuario o contraseña incorrectos", "#e53935");
    }
  });

  // Detectar clic fuera del modal
  window.onclick = function(event) {
    const modal = document.getElementById("modal-auth");
    if (event.target === modal) {
      cerrarModalAuth();
    }
  };

  // Redefinir la función cuando intentan comprar
  document.querySelectorAll(".product-card button").forEach(boton => {
    boton.addEventListener("click", () => {
      if (!estaLogueado()) {
        abrirModalAuth();
        return;
      }

      contadorCarrito++;
      document.getElementById("contador-carrito").textContent = contadorCarrito;
      mostrarMensaje("✅ Producto enviado al carrito");
    });
  });

  function abrirModalAuth(tipo = 'login') {
  mostrarFormulario(tipo);
  document.getElementById("modal-auth").style.display = "block";
}






 
 


  window.onload = function () {
    google.accounts.id.initialize({
      client_id: "AQUÍ_TU_CLIENT_ID_DE_GOOGLE",
      callback: handleCredentialResponse
    });

    google.accounts.id.renderButton(
      document.getElementById("googleButton"),
      {
        theme: "filled_blue",
        size: "large",
        text: "continue_with",
        shape: "pill"
      }
    );
  };

  function handleCredentialResponse(response) {
    const user = parseJwt(response.credential);
    const nombre = user.name || user.email;

    localStorage.setItem("usuarioLogueado", "true");
    localStorage.setItem("usuarioGoogle", nombre);

    cerrarModalAuth();
    mostrarMensaje(`🎉 Bienvenido, ${nombre}`);
  }

  function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')
    );
    return JSON.parse(jsonPayload);
  }





 function abrirModalAuth() {
    const modal = document.getElementById("modal-auth");
    modal.style.display = "flex";
  }

  function cerrarModalAuth() {
    const modal = document.getElementById("modal-auth");
    modal.style.display = "none";
  }

  function cerrarModalDesdeFondo(event) {
    const contenido = document.querySelector(".modal-content");
    if (!contenido.contains(event.target)) {
      cerrarModalAuth();
    }
  }

function abrirModalAuth() {
    document.getElementById("modal-auth").style.display = "flex";
    mostrarFormulario("login");
  }

  function cerrarModalAuth() {
    document.getElementById("modal-auth").style.display = "none";
  }

  function cerrarModalDesdeFondo(event) {
    const contenido = document.querySelector(".modal-content");
    if (!contenido.contains(event.target)) cerrarModalAuth();
  }

  function mostrarFormulario(tipo) {
    const loginForm = document.getElementById("form-login");
    const registerForm = document.getElementById("form-register");

    loginForm.style.display = tipo === "login" ? "block" : "none";
    registerForm.style.display = tipo === "register" ? "block" : "none";
  }

  // Registro manual
  document.getElementById("form-register").addEventListener("submit", function(e) {
    e.preventDefault();
    const nombre = document.getElementById("register-nombre").value;
    const correo = document.getElementById("register-email").value;
    const clave = document.getElementById("register-password").value;

    localStorage.setItem("usuario", nombre);
    localStorage.setItem("correo", correo);
    localStorage.setItem("clave", clave);
    localStorage.setItem("usuarioLogueado", "true");

    cerrarModalAuth();
    autenticar(nombre);
  });

  // Login manual
  document.getElementById("form-login").addEventListener("submit", function(e) {
    e.preventDefault();
    const correo = document.getElementById("login-usuario").value;
    const clave = document.getElementById("login-clave").value;

    if (correo === localStorage.getItem("correo") && clave === localStorage.getItem("clave")) {
      localStorage.setItem("usuarioLogueado", "true");
      autenticar(localStorage.getItem("usuario"));
      cerrarModalAuth();
    } else {
      alert("❌ Usuario o contraseña incorrectos");
    }
  });

  // Login con Google
  function handleCredentialResponse(response) {
    const user = parseJwt(response.credential);
    const nombre = user.name || user.email;

    localStorage.setItem("usuarioLogueado", "true");
    localStorage.setItem("usuarioGoogle", nombre);
    autenticar(nombre);
    cerrarModalAuth();
  }

  function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
    return JSON.parse(jsonPayload);
  }

  function autenticar(nombre) {
    document.getElementById("btn-login-header").style.display = "none";
    document.getElementById("btn-logout-header").style.display = "inline-block";

    const zonaVip = document.getElementById("zona-exclusiva");
    if (zonaVip) zonaVip.style.display = "block";

    alert(`🎉 Bienvenido, ${nombre}`);
  }

  function cerrarSesion() {
    localStorage.clear();
    document.getElementById("btn-login-header").style.display = "inline-block";
    document.getElementById("btn-logout-header").style.display = "none";
    const zonaVip = document.getElementById("zona-exclusiva");
    if (zonaVip) zonaVip.style.display = "none";
  }

  // Iniciar Google al cargar
  window.onload = function () {
    const logueado = localStorage.getItem("usuarioLogueado") === "true";
    if (logueado) {
      const nombre = localStorage.getItem("usuario") || localStorage.getItem("usuarioGoogle");
      autenticar(nombre);
    }

    google.accounts.id.initialize({
      client_id: "606874573278-4b2tnk76nd10r23gvpbg36plkrjlllan.apps.googleusercontent.com",
      callback: handleCredentialResponse
    });

    google.accounts.id.renderButton(
      document.getElementById("googleButton"),
      { theme: "outline", size: "large", shape: "pill" }
    );
  };


