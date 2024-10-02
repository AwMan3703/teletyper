"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = exports.User = void 0;
const utility_1 = require("./utility");
// User (client)
class User {
    constructor(username) {
        this.username = username;
        this.websocket = undefined;
        this.private_uuid = (0, utility_1.getUUID)();
        this.public_uuid = (0, utility_1.getUUID)();
    }
}
exports.User = User;
// A room for live texting
class Room {
    constructor(name, owner, max_participants = 5, invite_only = false, password = "") {
        this.name = name;
        this.owner = owner;
        this.max_participants = max_participants;
        this.invite_only = invite_only;
        this.password = password;
        this.id = (0, utility_1.getChatroomID)(); //crypto.randomUUID();
        this.participants = [owner];
        this.creation = new Date();
    }
    user_join(user) {
        this.participants.push(user);
    }
    user_disconnect(user) {
        this.participants.splice(this.participants.indexOf(user), 1);
    }
    message(sender) {
        this.participants.forEach(user => {
        });
    }
}
exports.Room = Room;
