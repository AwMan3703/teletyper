"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.liveUsers = exports.liveRooms = void 0;
const classes_1 = require("./classes");
const server_user = new classes_1.User("server");
// Keep track of currently open rooms
exports.liveRooms = [
    new classes_1.Room('test-room-1', server_user),
    new classes_1.Room('test-room-2', server_user),
    new classes_1.Room('test-room-3', server_user, undefined, true, 'pass123'),
    new classes_1.Room('test-room-4', server_user, 10, true, 'ciaoABC'),
];
// Keep track of connected users
exports.liveUsers = [];
exports.liveUsers.push(server_user);
const tpr = exports.liveRooms[2]; // Expose a private room for testing
console.log("Testing private room:", tpr.id, tpr.password);
