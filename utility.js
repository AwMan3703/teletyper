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
exports.isUsernameAvailable = isUsernameAvailable;
exports.createUser = createUser;
exports.deleteUser = deleteUser;
const crypto = __importStar(require("crypto"));
const classes_1 = require("./classes");
const data_1 = require("./data");
function getUUID() {
    return crypto.randomUUID();
}
function getID(length) {
    let result = [];
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
}
function isUsernameAvailable(username) {
    return !data_1.liveUsers.find(user => user.username === username);
}
function createUser(username) {
    const user = new classes_1.User(username);
    const token = getUUID();
    data_1.liveUsers.push(user);
    data_1.userTokens.set(user, token);
    return [user, token];
}
function deleteUser(user) {
    const room = data_1.liveRooms.find(room => room.get_participants.includes(user));
    if (room) {
        room.user_disconnect(user);
    }
    data_1.liveUsers.splice(data_1.liveUsers.indexOf(user), 1);
}
