//FRONT
const socket = io();
let userEmail = '';

async function reqEmail() {
  const { value: name } = await Swal.fire({
    title: 'Enter your mail',
    input: 'text',
    inputLabel: 'Your mail',
    inputValue: '',
    showCancelButton: false,
    inputValidator: (value) => {
      if (!value) {
        return 'You need to write your mail!';
      }
    },
  });

  userEmail = name;
}

reqEmail();

//FRONT EMITE

const chatBox = document.getElementById('chat-box');

chatBox.addEventListener('keyup', ({ key }) => {
  if (key == 'Enter') {
    socket.emit('msg_front_to_back', {
      email: userEmail,
      message: chatBox.value,
    });
    chatBox.value = '';
  }
});

//FRONT RECIBE
socket.on('msg_back_to_front', (msgs) => {
  // console.log(msgs);
  let msgsFormateados = '';
  msgs.forEach((msg) => {
    msgsFormateados += '<div class="msg-box">';
    msgsFormateados += '<p class="name">' + msg.email + '</p>';
    msgsFormateados += '<p class="msg">' + msg.message + '</p>';
    msgsFormateados += '</div>';
  });
  const divMsgs = document.getElementById('div-msgs');
  divMsgs.innerHTML = msgsFormateados;
});