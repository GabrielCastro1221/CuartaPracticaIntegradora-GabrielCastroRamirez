const socket = io();
let user;
const chatBox = document.getElementById("chatBox");

Swal.fire({
  title: "Skate & Destroy",
  input: "text",
  text: "Ingresa tu usuario",
  inputValidator: (value) => {
    return !value && "Necesitas ingresar tu usuario";
  },
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;
});

chatBox.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
      socket.emit("message", { user: user, message: chatBox.value });
      chatBox.value = "";
    }
  }
});

socket.on("message", (data) => {
  let log = document.getElementById("messagesLogs");
  let messages = "";

  data.forEach((message) => {
    messages =
      messages +
      `<span class="text-success fw-bold fs-6"> ${message.user}</span>: <strong>${message.message}</strong> <br>`;
  });

  log.innerHTML = messages;
});
