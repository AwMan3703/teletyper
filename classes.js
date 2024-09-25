"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = exports.User = void 0;
// User (client)
class User {
    constructor(username) {
        this.username = username;
    }
}
exports.User = User;
// A room for live texting
class Room {
    constructor(name, owner) {
        this.name = name;
        this.owner = owner;
        this.participants = [owner];
        this.creation = new Date();
    }
}
exports.Room = Room;
