const socket = io()

const welcome = document.getElementById("welcome")

const form = welcome.querySelector("form")
const room = document.getElementById("room");
room.hidden = true

let roomName;

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("input");
  const msg = input.value;
  socket.emit("new_message", msg, roomName, () => addMessage(`You: ${msg}`))
  input.value = ""
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`

  const form = room.querySelector('form');
  form.addEventListener('submit', handleMessageSubmit);
}

function handleSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", input.value, showRoom)
  roomName = input.value;
  input.value = ""
}
form.addEventListener("submit", handleSubmit)

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

socket.on("welcome", () => {
  addMessage("some joined")
})

socket.on("bye", () => {
  addMessage("some left")
})

socket.on("new_message", addMessage)