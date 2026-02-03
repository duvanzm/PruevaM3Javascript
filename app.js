// Variables Globales

// Formulario dode el usuario inicia sesion
const formIn = document.getElementById("form-in");

// Formulario donde el usuario se registra
const formUp = document.getElementById("form-up");

// Boton que muestra el formulario de registro
const upS = document.getElementById("up");

// Boton que muestra el formulario de login
const inS = document.getElementById("in");

// Mensaje que muestra errores o exito en el login
const msg = document.querySelector(".alert-acceso");

// Mensaje que muestra errores o exito en el registro
const msgR = document.querySelector(".register");

// Direccion donde estan guardados los usuarios "db"
const urlUsers = "http://localhost:3000/users";

// Funcion para mostrar el formulario de login
// -------------------------------------------------------------
window.singIn = function () {
  // Oculta el formulario de registro
  formUp.classList.add("d-none");

  // Muestra el formulario de login
  formIn.classList.remove("d-none");

  // Limpia los campos del login
  formIn.user.value = "";
  formIn.password.value = "";

  // Limpia el mensaje de error o exito
  msg.innerHTML = "";
};

// Función para mostrar el formulario de register
window.singUp = function () {
  // Oculta el formulario de login
  formIn.classList.add("d-none");

  // Muestra el formulario de registro
  formUp.classList.remove("d-none");

  // Limpia todos los inputs del formulario de registro
  formUp.querySelectorAll("input").forEach((input) => {
    input.value = "";
  });

  // Limpia el mensaje del registro
  msgR.innerHTML = "";
};

// Cuando el usuario hace clic en "Registrarse"
upS.addEventListener("click", (e) => {
  e.preventDefault(); // Evita que el enlace recargue la pagina
  singUp(); // Muestra el formulario de registro
});

// Cuando el usuario hace clic en "Iniciar sesion"
inS.addEventListener("click", (e) => {
  e.preventDefault(); // Evita que el enlace recargue la pagina
  singIn(); // Muestra el formulario de login
});

// Funcion Login de Usurios y Admins
// -----------------------------------------------------------------------
const login = async () => {
  try {
    // Pedimos la lista de usuarios al servidor db
    const respUser = await fetch(urlUsers);

    // Si alguna peticion falla, lanzamos un error
    if (!respUser.ok) {
      throw new Error("No se pudieron cargar los datos");
    }

    // Convertimos las respuestas a formato JSON
    const dataUser = await respUser.json();

    formIn.addEventListener("submit", (e) => {
      e.preventDefault(); // Evita recargar la pagina

      // Guardamos los valores que escribio el usuario
      const userValue = formIn.user.value.trim();
      const passwordValue = formIn.password.value.trim();

      // Verificamos que ningun campo este vacio
      if (!userValue || !passwordValue) {
        msg.innerHTML = `<span class="text-warning">Todos los campos son obligatorios</span>`;
        return;
      }

      // Buscamos si existe un usuario con esos datos
      const acceso = dataUser.find(
        (persona) =>
          persona.email === userValue && persona.password == passwordValue,
      );

      // Si no se encuentra el usuario
      if (!acceso) {
        msg.innerHTML = `<span class="text-danger">Datos incorrectos</span>`;
        return;
      }

      // LOGIN EXITOSO

      // Guardamos datos en sessionStorage
      sessionStorage.setItem("login", "true");
      sessionStorage.setItem("rol", acceso.role);
      sessionStorage.setItem("userId", acceso.id);

      // Mensaje de exito
      msg.innerHTML = `<span class="text-success">Acceso correcto, redirigiendo...</span>`;

      // Redirige segun el rol del usuario
      setTimeout(() => {
        if (acceso.role === "admin") {
          window.location.href = "./admin/dashboard.html";
        } else {
          window.location.href = "./user/home.html";
        }
      }, 3000);
    });
  } catch (error) {
    // Muestra errores en consola si algo falla
    console.error("Error:", error);
  }
};

// REGISTRO DE NUEVOS USUARIOS

const registerNewUser = async () => {
  let allUsers = [];

  try {
    // Obtenemos los usuarios ya registrados
    const resp = await fetch(urlUsers);

    if (!resp.ok) throw new Error("Error al cargar usuarios");

    allUsers = await resp.json();
  } catch (error) {
    console.error(error);
  }

  // Evento cuando se envia el formulario de registro
  formUp.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita recargar la pagina

    // Creamos el nuevo usuario
    const newUser = {
      avatar:
        "https://i.pinimg.com/originals/31/ec/2c/31ec2ce212492e600b8de27f38846ed7.jpg",
      name: formUp.name.value.trim(),
      email: formUp.email.value.trim(),
      password: formUp.password.value.trim(),
      rol: "user",
      date: new Date(),
    };

    for (let campo in newUser) {
      if (!newUser[campo]) {
        msgR.innerHTML = `<span class="text-warning">El campo ${campo} es obligatorio</span>`;
        return;
      }
    }

    // Verificamos si el usuario o correo ya existen
    const exists = allUsers.find((u) => u.emal === newUser.email);

    if (exists) {
      msgR.innerHTML = `<span class="text-danger">Usuario ya registrado</span>`;
      return;
    }

    try {
      // Enviamos el nuevo usuario al servidor
      const register = await fetch(urlUsers, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!register.ok) throw new Error("Error al registrar");

      // Mensaje de exito
      msgR.innerHTML = `<span class="text-success">Registro exitoso</span>`;

      // Redirige al login
      setTimeout(() => {
        window.location.href = "index.html";
      }, 3000);
    } catch (error) {
      msgR.innerHTML = `<span class="text-danger">Error al registrar</span>`;
    }
  });
};

// Activa la funcionalidad de registro
registerNewUser();
// Activa la funcionalidad de login
login();
