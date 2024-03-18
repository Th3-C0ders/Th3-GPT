const chatBox = document.querySelector(".chat-box");
const inputField = chatBox.querySelector("input[type='text']");
const button = chatBox.querySelector("button");
const chatBoxBody = chatBox.querySelector(".chat-box-body");

button.addEventListener("click", sendMessage);
inputField.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

function sendMessage() {
  const message = inputField.value;
  inputField.value = "";
  chatBoxBody.innerHTML += `<div class="message"><p>${message}</p></div>`;
  chatBoxBody.innerHTML += `<div id="loading" class="response loading">.</div>`;
  scrollToBottom();
  window.dotsGoingUp = true;
  var dots = window.setInterval(function () {
    var wait = document.getElementById("loading");
    if (window.dotsGoingUp)
      wait.innerHTML += ".";
    else {
      wait.innerHTML = wait.innerHTML.substring(1, wait.innerHTML.length);
      if (wait.innerHTML.length < 2)
        window.dotsGoingUp = true;
    }
    if (wait.innerHTML.length > 3)
      window.dotsGoingUp = false;
  }, 250);

  let customResponse = getCustomResponse(message);
  if (customResponse) {
    document.getElementById("loading").remove();
    chatBoxBody.innerHTML += `<div class="response"><p>${customResponse}</p></div>`;
    scrollToBottom();
    clearInterval(dots);
    return;
  }

  fetch('http://localhost:3000/message', {
    method: 'POST',
    headers: {
      accept: 'application.json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message })
  }).then(response => {
    return response.json();
  }).then(data => {
    document.getElementById("loading").remove();
    chatBoxBody.innerHTML += `<div class="response"><p>${data.message}</p></div>`;
    scrollToBottom();
    clearInterval(dots);
  });
}
function getCustomResponse(message) {
  const lowerCaseMessage = message.toLowerCase();
  if (lowerCaseMessage.includes("hi")) {
    return "Hi there! How can I help you?";
  } else if (lowerCaseMessage.includes("hello")) {
    return "Hello! What can I do for you today?";
   } else if (lowerCaseMessage.includes("what is ai")) {
   return "AI, or Artificial Intelligence, refers to the development of computer systems that can perform tasks that typically require human intelligence. These tasks include learning, reasoning, problem-solving, perception, understanding natural language, and interacting with the environment. AI can be divided into two main categories: Narrow AI, which is designed for specific tasks, and General AI, which would possess human-like cognitive abilities across a wide range of tasks.";
  } else if (lowerCaseMessage.includes("goodbye")) {
    return "Goodbye! Take care!";
  } else if (lowerCaseMessage.includes("bye")) {
    return "Bye! Have a nice day!";
  } else if (lowerCaseMessage.includes("who created you")) {
    return "I was created by Th3-C0ders.";
  } else if (lowerCaseMessage.includes("what is your name") || lowerCaseMessage.includes("who are you")) {
    return "I Am Th3-GPT, Your Friendly Assistant. I Was Created By Th3-C0der's";
  }
  return null;
}

function scrollToBottom() {
  chatBoxBody.scrollTop = chatBoxBody.scrollHeight;
}
