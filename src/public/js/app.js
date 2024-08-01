const socket = io()

const welcome = document.getElementById("welcome")
const form = welcome.querySelector("form")

const room = document.getElementById("room");
room.hidden = true

let roomName;
let nickName;

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const msg = input.value;
  socket.emit("new_message", msg, roomName, () => addMessage(`You: ${msg}`))
  input.value = ""
}

function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#nick input");
  socket.emit("nickname", input.value);
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`

  const msgForm = room.querySelector('#msg');
  const nickForm = room.querySelector('#nick');
  nickForm.querySelector("input").value = nickName
  nickForm.addEventListener('submit', handleNicknameSubmit)
  msgForm.addEventListener('submit', handleMessageSubmit);
}

function handleSubmit(event) {
  event.preventDefault();
  const inputs = form.querySelectorAll("input");
  const room = inputs[0]
  const nick = inputs[1]
  roomName = room.value;
  nickName = nick.value;
  socket.emit("enter_room", room.value, nick.value, showRoom)
  room.value = ""
  nick.value = ""
}

form.addEventListener("submit", handleSubmit)

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

socket.on("welcome", (user) => {
  addMessage(`${user} joined`)
})

socket.on("bye", (left) => {
  addMessage(`${left} left`)
})

socket.on("new_message", addMessage)