"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.liveRooms = exports.liveUsers = void 0;
const utility_1 = require("./utility");
// Keep track of connected users
exports.liveUsers = [];
// Create server user
const server_user = (0, utility_1.createUser)("server");
// Keep track of currently open rooms
exports.liveRooms = [];
(0, utility_1.createRoom)('Public-1', server_user, 10);
(0, utility_1.createRoom)('Public-2', server_user, 10);
(0, utility_1.createRoom)('Public-3', server_user, 10);
exports.liveRooms.forEach(room => {
    room.message(server_user, {
        token: server_user.sessionToken,
        type: "room_message",
        body: { text: `Welcome to ${room.name}! This is a public room, please be nice :)` }
    });
});
