"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = exports.User = void 0;
const utility_1 = require("./utility");
// User (client)
class User {
    constructor(username) {
        this.username = username;
        this.websocket = undefined;
        this.uuid = (0, utility_1.getUUID)();
    }
}
exports.User = User;
// A room for live texting
class Room {
    get get_participants() { return [...this.participants]; }
    constructor(name, owner, max_participants = 5, invite_only = false, password = "") {
        this.name = name;
        this.owner = owner;
        this.max_participants = max_participants;
        this.invite_only = invite_only;
        this.password = password;
        this.id = (0, utility_1.getID)(8);
        this.participants = [owner];
        this.creation = new Date();
    }
    broadcast(message) {
        this.participants.forEach(user => {
            if (!user) {
                return;
            }
            if (!user.websocket) {
                return;
            }
            user.websocket.send(JSON.stringify({
                private_uuid: `server-room-${this.id}`,
                type: message.type,
                body: message.body
            }));
        });
    }
    user_join(user) {
        this.participants.push(user);
        this.participants = this.participants.filter(user => user);
        this.broadcast({
            type: "room-event_user-join",
            body: { user: user }
        });
    }
    user_disconnect(user) {
        this.participants.splice(this.participants.indexOf(user), 1);
        this.participants = this.participants.filter(user => user);
        this.broadcast({
            type: "room-event_user-leave",
            body: { user: user }
        });
    }
    message(sender, message) {
        const copy = Object.assign({}, message);
        copy.body.sender = sender; // Add sender parameter
        this.broadcast(copy);
    }
}
exports.Room = Room;
