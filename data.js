"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.liveRooms = exports.liveUsers = void 0;
const classes_1 = require("./classes");
const utility_1 = require("./utility");
const server_user = new classes_1.User("server");
// Keep track of connected users
exports.liveUsers = [];
exports.liveUsers.push(server_user);
// Keep track of currently open rooms
exports.liveRooms = [];
(0, utility_1.createRoom)('test-room-1', server_user);
(0, utility_1.createRoom)('test-room-2', server_user);
(0, utility_1.createRoom)('test-room-3', server_user, undefined, true, 'pass123');
(0, utility_1.createRoom)('test-room-4', server_user, undefined, true, 'ciaoABC');
const tpr = exports.liveRooms[2]; // Expose a private room for testing
console.log("Testing private room:", tpr.id, tpr.password);
