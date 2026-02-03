const nota = document.querySelector(".nota");

const urlTasks = "http://localhost:3000/tasks";

// const id = sessionStorage.getItem("userId");
const id = sessionStorage.getItem("idClick");
console.log(id);
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

    return allTask;
  } catch (error) {
    // Captura errores de red o errores lanzados en el bloque try
    console.error("Error:", error);
  }
};

async function editar() {
  let allTask = await taskDb();

  let t = allTask.find((o) => o.id == id);
  console.log(allTask);
  nota.innerHTML = `
                        <div class="card-body">
                <h5 class="card-title mb-3">Data Nota</h5>

                <div class="mb-3">
                    <label class="form-label">Title</label>
                    <input
                    type="text"
                    class="form-control title"
                    id="title"
                    value="${t.title}"
                    />
                </div>

                <div class="row mb-3">
                    <div class="col-md-6">
                    <label class="form-label">category</label>
                    <input
                        type="text"
                        class="form-control category"
                        value="${t.category}"
                    />
                    </div>
                    <div class="col-md-6">
                    <label class="form-label">priority</label>
                    <input
                        type="text"
                        class="form-control priority"
                        value="${t.priority}"
                    />
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-6">
                    <label class="form-label">Status</label>
                    <input
                        type="text"
                        class="form-control status"
                        value="${t.status}"
                    />
                    </div>
                    <div class="col-md-6">
                    <label class="form-label">Du Data</label>
                    <input
                        type="text"
                        class="form-control duDate"
                        value="${t.dueDate}"
                    />
                    </div>
                </div>

                <div>
                    <label class="form-label">Description</label>
                    <textarea class="form-control description" rows="4">
    ${t.title}
                </textarea
                    >
                </div>
                </div>
        `;
}
editar();

const a = document.getElementById("#title");
console.log(a);
const updateNota = {
  title: document.querySelector(".title"),
  category: document.querySelector(".category"),
  priority: document.querySelector(".priority"),
  status: document.querySelector(".status"),
  description: document.querySelector(".description"),
};

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("save")) {
    e.preventDefault();

    async function updateNota(id, datos) {
      const url = `urlTasks/${id}`;

      try {
        const response = await fetch(url, {
          method: "PATCH", // Método HTTP para actualización parcial
          headers: {
            "Content-Type": "application/json",
            // 'Authorization': 'Bearer token' // Si es necesario
          },
          body: JSON.stringify(datos), // Convertir datos a JSON
        });

        // Validar si la respuesta es exitosa
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json(); // Parsear respuesta JSON
        alert("Usuario actualizado:", data);
        return data;
      } catch (error) {
        console.error("Error al realizar PATCH:", error);
        // Manejar el error adecuadamente (ej. mostrar mensaje al usuario)
      }
    }
    updateNota(id, updateNota);
  }
});

// editar();
// async function crear(newTask) {
//       try {
//         const response = await fetch(urlTasks, {
//           method: "POST", // Método POST
//           headers: {
//             "Content-Type": "application/json", // Indica formato JSON
//           },
//           body: JSON.stringify(newTask), // Convierte el objeto a cadena JSON
//         });

//         // 3. Verificar si la respuesta es correcta
//         if (!response.ok) {
//           throw new Error(`Error: ${response.status}`);
//         }

//         // 4. Parsear respuesta
//         const resultado = await response.json();
//         console.log("Datos enviados con éxito:", resultado);
//         alert("Fue editato con exito");
//         return true;
//       } catch (error) {
//         // 5. Capturar y manejar errores de red o excepciones
//         console.error("Error en la petición POST:", error);
//       }
//     }
//     crear(updateNota);
//   }
