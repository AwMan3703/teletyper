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
exports.isUsernameValid = isUsernameValid;
exports.isUsernameAvailable = isUsernameAvailable;
exports.createUser = createUser;
exports.deleteUser = deleteUser;
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
function isUsernameValid(username) {
    return username.length > 0 && username.length < 21;
}
function isUsernameAvailable(username) {
    return !data_1.liveUsers.find(user => user.username === username);
}
function createUser(username) {
    const user = new classes_1.User(username);
    data_1.liveUsers.push(user);
    return user;
}
function deleteUser(user) {
    const room = data_1.liveRooms.find(room => room.get_participants.includes(user));
    if (room) {
        room.user_disconnect(user);
    }
    data_1.liveUsers.splice(data_1.liveUsers.indexOf(user), 1);
}
