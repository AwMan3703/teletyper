"use strict";
const URLparameters = new URLSearchParams(window.location.search);
const roomID = URLparameters.get('room-id');
const roomPassword = URLparameters.get('room-password');
const chatroomTitle = document.getElementById('chat-title');
const chatroomOwner = document.getElementById('chat-owner');
const chatroomParticipantsCounter = document.getElementById('chat-participant-counter');
const chatroomCreationDate = document.getElementById('chat-creation-date');
function updateRoomData(room) {
    // @ts-ignore
    chatroomTitle.innerText = room.name;
    // @ts-ignore
    chatroomOwner.innerText = '@' + room.owner.username;
    // @ts-ignore
    chatroomParticipantsCounter.innerText = `${room.participants.length}/${room.max_participants}`;
    // @ts-ignore
    chatroomCreationDate.innerText = new Date(room.creation).toLocaleTimeString();
}
function updateRoomData_roomNotFound() {
    // @ts-ignore
    chatroomTitle.innerText = 'Room not found';
}
function updateRoomData_wrongOrMissingPassword() {
    // @ts-ignore
    chatroomTitle.innerText = 'Wrong password';
}
function updateRoomData_usernameTaken() {
    // @ts-ignore
    chatroomTitle.innerText = 'Username Taken';
}
function joinRoom() {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `/rooms/join/${roomID}`, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (this.response.status === 404) {
                updateRoomData_roomNotFound();
            }
            else if (this.response.status === 401) {
                updateRoomData_wrongOrMissingPassword();
            }
            else if (this.response.status === 409) {
                updateRoomData_usernameTaken();
            }
            else if (!this.response.ok) {
                throw new Error(`HTTP error! status: ${this.response.status}`);
            }
            else {
                const room = JSON.parse(this.responseText);
                console.log("Chatroom Data:", room);
                document.title = `${room.name} — TeleTyper`;
                updateRoomData(room);
            }
        }
    };
    const body = new URLSearchParams();
    body.set('password', roomPassword ? roomPassword : '');
    body.set('username', 'nobody');
    xhr.send(body);
}
joinRoom();
/*fetch(`/rooms/join/${roomID}?password=${roomPassword}`)
    .then(response => {
        // Check if the response is OK (status code in the range 200-299)
        if (response.status === 401) {
            updateRoomData_wrongOrMissingPassword()
        } else if (response.status === 404) {
            updateRoomData_roomNotFound()
        } else if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Parse JSON data
    })
    .then(room => {
        console.log("Chatroom Data:", room);
        document.title = `${room.name} — TeleTyper`
        updateRoomData(room)
    })
    .catch(error => console.error('Error fetching chatroom data:', error));
*/
// TODO: register user @ /register-user
// TODO: chat through websockets
