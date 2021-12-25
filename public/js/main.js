const socket = io();
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
const chatMessages = document.querySelector(".chat-messages");

const form = document.querySelector("#chat-form");
socket.on("message", (message) => {
  outputMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.emit("joinRoom", { username, room });
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = document.getElementById("msg").value;
  document.getElementById("msg").value = "";
  socket.emit("chatMessage", { message, username });
});

socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Output message to DOM
function outputMessage(message) {
  console.log(message);
  const chatMessages = document.querySelector(".chat-messages");
  const div = document.createElement("div");
  div.classList.add("message");
  const p = document.createElement("p");
  p.classList.add("meta");
  p.innerText = message.user;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement("p");
  para.classList.add("text");
  para.innerText = message.message;
  div.appendChild(para);
  chatMessages.appendChild(div);
}

function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}


document.getElementById("leave-btn").addEventListener("click", () => {
  window.location = "../index.html";
});
