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
    new classes_1.Room('test-room-4', server_user),
    new classes_1.Room('test-room-5', server_user),
    new classes_1.Room('test-room-6', server_user, undefined, true, 'ciaoABC'),
    new classes_1.Room('test-room-7', server_user),
    new classes_1.Room('test-room-8', server_user),
    new classes_1.Room('test-room-9', server_user, undefined, true, '0000')
];
// Keep track of connected users
exports.liveUsers = [];
exports.liveUsers.push(server_user);
const tpr = exports.liveRooms[2]; // Expose a private room for testing
console.log("Testing private room:", tpr.id, tpr.password);
