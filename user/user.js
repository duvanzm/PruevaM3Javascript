// Variables Globales
const addListproducts = document.querySelector("#productsTable");
const addProductButton = document.querySelector(".add");
const updateButton = document.querySelector(".update");
const deleteButton = document.querySelector(".delete");

const total = document.querySelector(".total");
const completed = document.querySelector(".completed");
const pending = document.querySelector(".pending");
const overall = document.querySelector(".overall");

// Traer datos del localStorage
// const data = localStorage.getItem("products");
// let productsList = data ? JSON.parse(data) : [];

const urlTasks = "http://localhost:3000/tasks";

if (sessionStorage.getItem("login") !== "true") {
  window.location.href = "../index.html";
}

let dataTask = "";
//   {
//     "title": "Tarea User 1",
//     "category": "Other",
//     "priority": "Low",
//     "status": "pending",
//     "dueDate": "2025-02-02",
//     "description": "Tarea de prueba # 1",
//     "userId": 2,
//     "createdAt": "2026-02-02T15:50:59.722Z",
//     "updatedAt": "2026-02-02T15:51:42.331Z",
//     "id": 1
//   },

const id = sessionStorage.getItem("userId");
// const id = 2;

const taskDb = async () => {
  try {
    // Pedimos la lista de usuarios al servidor db
    const respTask = await fetch(urlTasks);

    // Si alguna peticion falla, lanzamos un error
    if (!respTask.ok) {
      throw new Error("No se pudieron cargar los datos");
    }

    // Convertimos las respuestas a formato JSON
    const allTask = await respTask.json();
    // console.log(allTask);
    let userTask = allTask.filter((o) => o.userId === id);
    // dataTask = userTask;
    // console.log(userTask);
    // Datos
    return allTask;
  } catch (error) {
    // Captura errores de red o errores lanzados en el bloque try
    console.error("Error:", error);
  }
};

async function eliminar(id) {
  try {
    const response = await fetch(`http://localhost:3000/tasks/${id}`, {
      method: "DELETE", // Especificar el método
      headers: {
        "Content-Type": "application/json",
        // 'Authorization': 'Bearer token' // Si se requiere
      },
    });

    // Verificar si la respuesta es exitosa (código 200-299)
    if (!response.ok) {
      throw new Error("Error al eliminar el recurso");
    }

    //  Procesar respuesta si el servidor envía datos
    const data = await response.json();
    console.log(`Recurso ${id} eliminado con éxito`);
    alert(`Recurso ${id} eliminado con éxito`);
    return true;
  } catch (error) {
    // Captura errores de red o errores lanzados en el bloque try
    console.error("Error:", error);
  }
}

async function render() {
  let allTask = await taskDb();
  console.log(allTask);
  let userTask = allTask.filter((o) => o.userId == id);

  addListproducts.innerHTML = "";
  userTask.forEach((t) => {
    const row = `
            <tr>
                <td>${t.title}</td>
                <td>${t.df}</td>
                <td>${t.status}</td>
                <td>${t.priority}</td>
                <td>${t.dueDate}</td>
                <td>
                    <button data-id="${t.id}" class="btn btn-sm btn-warning update">Edit</button>
                    <button data-id="${t.id}" class="btn btn-sm btn-danger delete">Delete</button>
                </td>
            </tr>
        `;
    document.getElementById("productsTable").innerHTML += row;
  });

  total.innerHTML = `<span>${userTask.length}</span>`;
  completed.innerHTML = `<span>${userTask.filter((o) => o.status === "completed").length}</span>`;
  pending.innerHTML = `<span>${userTask.filter((o) => o.status === "pending").length}</span>`;
  overall.innerHTML = `<span>${userTask.length}</span>`;
}

document.addEventListener("click", function (event) {
  // Traer id al ser click
  //   let fila = event.target.closest("tr");

  let idTask = event.target.dataset.id;
  sessionStorage.setItem("idClick", idTask);
  console.log(idTask);
  //   Update
  if (event.target.classList.contains("update")) {
    // window.open("./addProduct.html", "_self");
    window.location = "nota.html";
  }
  //   Delete
  if (event.target.classList.contains("delete")) {
    // Llamar a la función
    eliminar(idTask);
  }
});

render();
export default taskDb;
