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
    constructor(name, owner, invite_only = false) {
        this.name = name;
        this.owner = owner;
        this.invite_only = invite_only;
        this.participants = [owner];
        this.creation = new Date();
    }
}
exports.Room = Room;
