"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.liveUsers = exports.liveRooms = void 0;
const classes_1 = require("./classes");
// Keep track of currently open rooms
exports.liveRooms = [
    new classes_1.Room('test-room-1', new classes_1.User('test-user-1')),
    new classes_1.Room('test-room-2', new classes_1.User('test-user-2')),
    new classes_1.Room('test-room-3', new classes_1.User('test-user-3'), undefined, true),
    new classes_1.Room('test-room-4', new classes_1.User('test-user-4')),
    new classes_1.Room('test-room-5', new classes_1.User('test-user-5')),
    new classes_1.Room('test-room-6', new classes_1.User('test-user-6'), undefined, true),
    new classes_1.Room('test-room-7', new classes_1.User('test-user-7')),
    new classes_1.Room('test-room-8', new classes_1.User('test-user-8')),
    new classes_1.Room('test-room-9', new classes_1.User('test-user-9'), undefined, true)
];
// Keep track of connected users
exports.liveUsers = [];
