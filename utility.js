"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUUID = getUUID;
exports.getID = getID;
exports.clamp = clamp;
exports.isUsernameValid = isUsernameValid;
exports.isUsernameAvailable = isUsernameAvailable;
exports.createUser = createUser;
exports.deleteUser = deleteUser;
exports.isRoomNameValid = isRoomNameValid;
exports.isRoomNameAvailable = isRoomNameAvailable;
exports.createRoom = createRoom;
exports.deleteRoom = deleteRoom;
const crypto = __importStar(require("crypto"));
const classes_1 = require("./classes");
const data_1 = require("./data");
function getUUID() {
    return crypto.randomUUID();
}
const IDs = [];
function getID(length, iteration = 0) {
    const max_iterations = 500;
    if (iteration > max_iterations) {
        throw new Error(`Could not generate a unique ID in ${max_iterations} iterations`);
    }
    let result = [];
    const characters = '' +
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
        'abcdefghijklmnopqrstuvwxyz' +
        '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    result = result.join('');
    // If the ID was already generated, get a new one
    if (IDs.includes(result)) {
        return getID(length, iteration + 1);
    }
    // If the ID is unique, return it
    else {
        return result;
    }
}
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
function isUsernameValid(username) {
    return username.length > 0 && username.length < 21;
}
function isUsernameAvailable(username) {
    return !data_1.liveUsers.find(user => user.username.toLowerCase() === `@${username.toLowerCase()}`);
}
function createUser(username) {
    const user = new classes_1.User(username);
    data_1.liveUsers.push(user);
    return user;
}
function deleteUser(user) {
    var _a;
    const room = data_1.liveRooms.find(room => room.get_participants.includes(user));
    if (room) {
        room.user_disconnect(user);
    }
    (_a = user.websocket) === null || _a === void 0 ? void 0 : _a.close();
    data_1.liveUsers.splice(data_1.liveUsers.indexOf(user), 1);
}
function isRoomNameValid(room_name) {
    return room_name.length > 0 && room_name.length < 21;
}
function isRoomNameAvailable(room_name) {
    return !data_1.liveRooms.find(room => room.name === room_name);
}
function createRoom(name, owner, max_participants, invite_only, password) {
    if (!name) {
        name = `${owner.username}'s room #${getID(4)}`;
    }
    const room = new classes_1.Room(name, owner, max_participants, invite_only || false, password || "");
    data_1.liveRooms.push(room);
    room.user_join(owner);
    return room;
}
function deleteRoom(room) {
    room.get_participants.forEach(participant => {
        deleteUser(participant);
    });
    data_1.liveRooms.splice(data_1.liveRooms.indexOf(room), 1);
}
