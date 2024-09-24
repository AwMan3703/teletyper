"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.liveRooms = void 0;
const classes_1 = require("./classes");
// Keep track of currently open rooms
exports.liveRooms = [
    new classes_1.Room('test-room', new classes_1.User('test-user'))
];
