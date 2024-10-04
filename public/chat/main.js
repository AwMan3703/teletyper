"use strict";
// CONSTANTS
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let SESSION_TOKEN = '';
const WEBSOCKET_PORT = 8080;
const debounceTimeout = 500; // Timeout for live typing updates (in ms)
let lastDebounceTimestamp = Date.now();
const URLparameters = new URLSearchParams(window.location.search);
const roomID = URLparameters.get('room-id');
const roomPassword = URLparameters.get('room-password');
const chatroomTitle = document.getElementById('chat-title');
const chatroomOwner = document.getElementById('chat-owner');
const chatroomParticipantsCounter = document.getElementById('chat-participant-counter');
const chatroomCreationDate = document.getElementById('chat-creation-date');
const liveTypersList = document.getElementById('live-typers-list');
const liveTyperTemplate = document.getElementById('live-typer-template');
const typerInput = document.getElementById('chat-input');
// FUNCTIONS
const liveTyperID = (user_uuid) => `liveTyper_${user_uuid}`;
const getLiveTyperOutput = (user_uuid) => document.getElementById(`liveTyper_${user_uuid}`);
function _new_liveTyperElement(user) {
    // @ts-ignore
    const node = liveTyperTemplate.content.cloneNode(true);
    const username = node.querySelector(".live-typer-username");
    const content = node.querySelector(".live-typer-content");
    username.innerText = `@${user.username}`;
    content.id = liveTyperID(user.uuid);
    return node;
}
function fetchRoomData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Fetch and display room data
            const response = yield fetch(`/rooms/data/${roomID}`);
            // Check if the response is OK (status code in the range 200-299)
            if (response.status === 404) {
                // @ts-ignore
                chatroomTitle.innerText = 'Room not found';
            }
            else if (response.status === 401) {
                // @ts-ignore
                chatroomTitle.innerText = 'Wrong/Missing password';
            }
            else if (399 < response.status && response.status < 500) {
                // @ts-ignore
                chatroomTitle.innerText = 'Something went wrong :/';
            }
            else if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const json = yield response.json();
            console.log("Chatroom Data:", json);
            document.title = `${json.name} — TeleTyper`;
            return json;
        }
        catch (error) {
            console.error('Error fetching chatroom data:', error);
        }
    });
}
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
function updateLiveTypers(room) {
    // @ts-ignore
    liveTypersList.childNodes.forEach(child => child.remove());
    room.participants.forEach((participant) => {
        // @ts-ignore
        liveTypersList.appendChild(_new_liveTyperElement(participant));
    });
}
// SCRIPT
// Register the user to this room
const xhr = new XMLHttpRequest();
xhr.open('POST', `/rooms/join/${roomID}`);
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhr.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE) {
        if (199 < this.status && this.status < 300) { // May return 200 or 202
            const data = JSON.parse(this.responseText);
            SESSION_TOKEN = data.session_token;
        }
        else if (!this.response.ok) {
            throw new Error(`HTTP error! status: ${this.response}`);
        }
    }
};
const body = new URLSearchParams();
body.set('password', roomPassword ? roomPassword : '');
body.set('username', prompt('Username?') || '[nobody]'); // TODO: actually let the user choose the username
xhr.send(body);
// --- WebSockets --- //
// Open a websocket for communication
const websocketAddress = `ws://${window.location.hostname}:${WEBSOCKET_PORT}`;
console.log(`Room WebSocket address is ${websocketAddress}`);
const websocket = new WebSocket(websocketAddress);
// Shorthand because I'm lazy
const sendWebSocketMessage = (type, body = {}) => {
    websocket.send(JSON.stringify({ token: SESSION_TOKEN, type: type, body: body }));
};
// Wait for the websocket to open
websocket.onopen = (e) => {
    // Send an empty message to get registered
    sendWebSocketMessage('confirm_registration');
    // @ts-ignore
    typerInput.oninput = e => {
        // @ts-ignore
        let new_content = typerInput.value;
        // Debounce — if updates are too frequent, queue the data for the next ones
        if ((Date.now() - lastDebounceTimestamp) <= debounceTimeout) {
            return;
        }
        console.log('Sending live-typer updates');
        // Send the new text
        sendWebSocketMessage('room_message', { text: new_content });
        // Reset the debounce counter
        lastDebounceTimestamp = Date.now();
    };
};
// Handle incoming messages
const handleWebSocketMessage = (type, message, handler) => { if (type === message.type) {
    handler(message.body);
} };
websocket.onmessage = (e) => {
    const message = JSON.parse(e.data);
    if (message.type.includes('room-event')) {
        fetchRoomData().then(roomData => updateRoomData(roomData));
    }
    // User has joined the room
    handleWebSocketMessage('room-event_user-join', message, (body) => {
        if (!body.user) {
            console.error('Malformed data: WebSocket message has no user');
            return;
        }
        if (!body.user.uuid) {
            console.error('Malformed data: WebSocket message user has no UUID');
            return;
        }
        if (!body.user.username) {
            console.error('Malformed data: WebSocket message user has no username');
            return;
        }
        alert(`@${body.user.username} joined the room!`);
        // @ts-ignore
        liveTypersList.appendChild(_new_liveTyperElement(body.user));
    });
    // User has left the room
    handleWebSocketMessage('room-event_user-leave', message, (body) => {
        if (!body.user) {
            console.error('Malformed data: WebSocket message has no user');
            return;
        }
        if (!body.user.uuid) {
            console.error('Malformed data: WebSocket message user has no UUID');
            return;
        }
        if (!body.user.username) {
            console.error('Malformed data: WebSocket message user has no username');
            return;
        }
        alert(`@${body.user.username} left the room!`);
        // @ts-ignore
        liveTypersList.querySelector(`#${liveTyperID(user.uuid)}`).remove();
    });
    handleWebSocketMessage('room_message', message, (body) => {
        if (!body.sender) {
            console.error('Malformed data: WebSocket message has no sender');
            return;
        }
        if (!body.sender.uuid) {
            console.error('WebSocket message user has no UUID');
            return;
        }
        if (!body.text) {
            console.error("Malformed data: WebSocket message user has no text");
            return;
        }
        console.log(`Updating @${body.sender.username}'s live-typer (${liveTyperID(body.sender.uuid)})`);
        // @ts-ignore
        getLiveTyperOutput(body.sender.uuid).innerText = body.text;
    });
};
fetchRoomData()
    .then(roomData => {
    updateRoomData(roomData);
    updateLiveTypers(roomData);
});
