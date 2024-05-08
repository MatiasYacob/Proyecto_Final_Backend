


const socket = io();


document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector('form');

  if (form) {
      form.addEventListener("submit", (e) => {
          e.preventDefault();

          const formData = new FormData(form);

          const post = {
              title: formData.get("title"),
              description: formData.get("description"),
              price: formData.get("price"),
              thumbnails: formData.get("thumbnails"),
              code: formData.get("code"),
              stock: formData.get("stock"),
          }
          socket.emit("post_send", post);
      });
  }
});

socket.on("productos", (data) => {
    const products = document.querySelector("#products");
    products.innerHTML = "";

    data.forEach((producto) => {
        const productElement = document.createElement("div");
        productElement.classList.add("card", "m-2", "col-md-3", "bg-light", "border", "border-primary"); // Clases de Bootstrap para estilo
        productElement.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${producto.title}</h5>
                <p class="card-text">Descripción: ${producto.description}</p>
                <p class="card-text">Precio: $${producto.price}</p>
                <p class="card-text">Código: ${producto.code}</p>
                <p class="card-text">Stock: ${producto.stock}</p>
                <p class="card-text">Fotos: ${producto.thumbnails}</p>
                <p class="card-text">Status: ${producto.status}</p>
                <p class="card-text">ID: ${producto._id}</p>
                <button class="btn btn-danger" onclick="deleteProduct('${producto._id}')">Eliminar</button>

            </div>
        `;
        products.appendChild(productElement);
    });
});

function deleteProduct(_id) {
    socket.emit("delete_product", _id);
}

socket.on("connect_error", (error) => {
    console.error("Error de conexión con el servidor:", error);
});


//Logica del Chat
let user;
let askingForName = true;
console.info("hola");
function scrollToBottom() {
  const chatMessages = document.getElementById("messages");
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function askForNameAndSendMessage(message) {
  Swal.fire({
    title: "Hola",
    text: "Ingresa tu nombre para continuar",
    input: "text",
    inputValidator: (value) => {
      return !value && "¡Ingresa tu nombre!";
    },
    allowOutsideClick: false,
  }).then((value) => {
    user = value.value;
    socket.emit("newUser", user);
    askingForName = false;
    if (message.trim() !== "") {
      socket.emit("message", {
        user,
        message,
      });
    }
  });
}

askForNameAndSendMessage(""); // Llamar al inicio para solicitar el nombre

const chatbox = document.getElementById("chatbox");
// Función para enviar un mensaje al servidor
function sendMessage() {
  const message = chatbox.value.trim();
  if (user === undefined && !askingForName) {
    askForNameAndSendMessage(message);
  } else if (message !== "") {
    socket.emit("message", {
      user,
      message,
    });
    chatbox.value = "";
  }
}

// Event listener para enviar mensaje al presionar Enter
chatbox.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

// Event listener para enviar mensaje al hacer clic en el botón de enviar
const sendButton = document.getElementById("sendButton");
sendButton.addEventListener("click", () => {
  sendMessage();
});


socket.on("userConnected", (username) => {
  if (user !== undefined && !askingForName) {
    Swal.fire({
      position: "top-right",
      toast: true,
      title: "Nuevo usuario",
      text: `${username} se ha conectado al chat`,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", () => {
          Swal.stopTimer();
        });
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
  }
});

socket.on("messages",  (data) => {
  const log = document.querySelector("#messages");
  let messages = "";

  data.forEach((message) => {
    const timestamp = new Date(message.timestamp); // Convertir la marca de tiempo a un objeto Date
    const formattedTime = timestamp.toLocaleTimeString(); // Formatear la hora
    const formattedDate = timestamp.toLocaleDateString(); // Formatear la fecha
    messages += `
  <strong>${message.user}:</strong> ${message.message}  
  <span style="float: right;">
    <b>Dicho a las:</b> (${formattedTime},${formattedDate})
  </span>
  <br/>
`;

  });

  log.innerHTML = messages;
  scrollToBottom();
});
