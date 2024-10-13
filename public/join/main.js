"use strict";
// VARIABLES
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let IS_PASSWORD_REQUIRED = false;
// @ts-ignore
const URLParameters = new URLSearchParams(window.location.search);
const url_roomID = URLParameters.get('room-id');
const url_roomPassword = URLParameters.get('room-password');
const url_username = URLParameters.get('username');
const room_id_input = document.getElementById('room-ID');
// @ts-ignore
const room_password_input = document.getElementById('room-password');
// @ts-ignore
const username_input = document.getElementById('username');
// @ts-ignore
const back_button = document.getElementById('back-button');
const join_button = document.getElementById('join-button');
// FUNCTIONS
function room_credentials_validator(room_id, room_password) {
    return __awaiter(this, void 0, void 0, function* () {
        const RESULT = {
            // @ts-ignore
            ID_VALID: room_id_input.classList.contains('valid'),
            // @ts-ignore
            PASSWORD_VALID: room_password_input.classList.contains('valid')
        };
        // Easy conditions to avoid making too many requests
        if (room_id.length !== 6) {
            RESULT.ID_VALID = false;
            RESULT.PASSWORD_VALID = false;
            return RESULT;
        }
        // GET the endpoint
        const response = yield fetchRoomData(room_id, room_password);
        // If the response is 200-299, both credentials are valid
        if (response.ok) {
            RESULT.ID_VALID = true;
            RESULT.PASSWORD_VALID = true;
        }
        // If the response code is 401, we know the password is required
        else if (response.status === 401) {
            setPasswordRequired(true);
            RESULT.ID_VALID = true;
            RESULT.PASSWORD_VALID = false;
        }
        // If the response code is otherwise not ok, neither are correct
        else {
            RESULT.ID_VALID = false;
            RESULT.PASSWORD_VALID = false;
        }
        return RESULT;
    });
}
function room_id_input_validator(value) {
    return __awaiter(this, void 0, void 0, function* () {
        // @ts-ignore
        const room_password = room_password_input.value;
        const result = yield room_credentials_validator(value, room_password);
        // @ts-ignore
        setValidityClass(room_password_input, result.PASSWORD_VALID);
        return result.ID_VALID;
    });
}
function room_password_input_validator(value) {
    return __awaiter(this, void 0, void 0, function* () {
        // @ts-ignore
        const room_id = room_id_input.value;
        const result = yield room_credentials_validator(room_id, value);
        // @ts-ignore
        setValidityClass(room_id_input, result.ID_VALID);
        return result.PASSWORD_VALID;
    });
}
// @ts-ignore
function username_input_validator(value) {
    return __awaiter(this, void 0, void 0, function* () {
        // Easy conditions to avoid making too many requests
        if (value.length < 1 || value.length > 20) {
            return false;
        }
        // GET the endpoint
        const response = yield fetch(`/check/username/${value}`);
        // Return true if the status is in the 200 range
        return response.ok;
    });
}
function joinChat(room_id, room_password, username) {
    if (!room_id || room_id.length !== 6) {
        console.error('Cannot redirect to chat: Room ID is missing or invalid');
        return;
    }
    if (!username) {
        console.error('Cannot redirect to chat: Username is missing');
        return;
    }
    const params = new URLSearchParams();
    if (room_password)
        params.set('password', room_password);
    params.set('username', username);
    // REQUEST USER REGISTRATION //
    fetch(`rooms/join/${room_id}?${params.toString()}`)
        .then(response => {
        if ([200, 202].includes(response.status)) { // May return 200 or 202
            // Return
            return response.json();
        }
        else if (response.status === 404) { // The room code is wrong
            // @ts-ignore
            setValidityClass(room_password_input, false);
        }
        else if ([406, 409].includes(response.status)) { // Someone stole the username before we connected
            // @ts-ignore
            setValidityClass(username_input, false);
        }
        else if (response.status === 401) { // The password is wrong I guess?
            // @ts-ignore
            setValidityClass(room_password_input, false);
        }
        else if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    })
        .then(data => {
        // Get the session token
        const token = data.session_token;
        console.log(`Obtained session token (${token})`);
        // Save the session token
        localStorage.setItem('session-token', token);
        // Create url parameters
        const params = new URLSearchParams();
        params.set('room-id', room_id);
        if (room_password)
            params.set('room-password', room_password);
        params.set('username', username);
        // Redirect to chat page
        window.location.href = `chat.html?${params.toString()}`;
    });
    // ######################### //
}
const setPasswordRequired = (is_required) => {
    IS_PASSWORD_REQUIRED = is_required;
    // @ts-ignore
    room_password_input.toggleAttribute('required');
};
// SCRIPT
if (url_roomID && url_roomPassword && url_username) {
    joinChat(url_roomID, url_roomPassword, url_username);
}
else {
    if (url_roomID) {
        // @ts-ignore
        room_id_input.value = url_roomID;
        // @ts-ignore
        if (url_roomID)
            room_id_input_validator(url_roomID).then(is_valid => { setValidityClass(room_id_input, is_valid); });
    }
    if (url_roomPassword) {
        // @ts-ignore
        room_password_input.value = url_roomPassword ? url_roomPassword : '';
        // @ts-ignore
        if (url_roomPassword)
            room_password_input_validator(url_roomPassword).then(is_valid => { setValidityClass(room_password_input, is_valid); });
    }
    if (url_username) {
        // @ts-ignore
        username_input.value = url_username ? url_username : '';
        // @ts-ignore
        if (url_username)
            username_input_validator(url_username).then(is_valid => { setValidityClass(username_input, is_valid); });
    }
}
// @ts-ignore
validateInput(room_id_input, ['focusout'], room_id_input_validator);
// @ts-ignore
validateInput(room_password_input, ['focusout'], room_password_input_validator);
// @ts-ignore
validateInput(username_input, ['focusout'], username_input_validator);
// @ts-ignore
back_button.onclick = function () {
    window.history.back();
};
// @ts-ignore
join_button.onclick = function () {
    // @ts-ignore
    const room_id = (room_id_input === null || room_id_input === void 0 ? void 0 : room_id_input.value) || url_roomID;
    // @ts-ignore
    const room_password = (room_password_input === null || room_password_input === void 0 ? void 0 : room_password_input.value) || url_roomPassword;
    // @ts-ignore
    const username = (username_input === null || username_input === void 0 ? void 0 : username_input.value) || url_username;
    if (!room_id) {
        alert('Room ID is missing! Please fill all required inputs');
        return;
    }
    if (IS_PASSWORD_REQUIRED && (!room_password || room_password === '')) {
        alert('Please enter a valid password');
        return;
    }
    if (!username) {
        alert('Username is missing! Please fill all required inputs');
        return;
    }
    joinChat(room_id, room_password, username);
};
// For now
setPasswordRequired(false);
