"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = exports.User = void 0;
const utility_1 = require("./utility");
// User (client)
class User {
    constructor(username) {
        this.username = username;
        this.websocket = undefined;
        this.uuid = (0, utility_1.getID)(20);
        this.sessionToken = (0, utility_1.getUUID)();
    }
    toJSON() {
        return {
            username: this.username,
            uuid: this.uuid,
        };
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
        this.id = (0, utility_1.getID)(6);
        this.participants = [owner];
        this.creation = new Date();
        this.userText = new Map();
    }
    toJSON() {
        return {
            name: this.name,
            id: this.id,
            owner: this.owner,
            participants: this.get_participants,
            max_participants: this.max_participants,
            creation: this.creation,
            invite_only: this.invite_only
        };
    }
    broadcast(message) {
        // For each participant
        this.participants.forEach(participant => {
            if (!participant.websocket) {
                return;
            }
            // Send the message
            participant.websocket.send(JSON.stringify(message));
        });
    }
    user_join(user) {
        // Add the user
        this.participants.push(user);
        this.participants = this.participants.filter(user => user);
        // Add user content
        this.userText.set(user, '');
        // Broadcast join event
        this.broadcast({
            type: "room-event_user-join",
            body: { user: user }
        });
        // FIXME: user does not receive old text because its websocket is undefined at this time
        // Catch the new user up
        this.participants.forEach(participant => {
            // @ts-ignore
            user.websocket.send(JSON.stringify({
                type: "room_message",
                body: {
                    sender: participant.uuid,
                    text: this.userText.get(participant)
                }
            }));
        });
    }
    user_disconnect(user) {
        // Remove the user
        this.participants.splice(this.participants.indexOf(user), 1);
        this.participants = this.participants.filter(user => user);
        // Remove user content
        this.userText.delete(user);
        // Broadcast disconnect event
        this.broadcast({
            type: "room-event_user-leave",
            body: { user: user }
        });
    }
    message(sender, message) {
        // Copy the message
        const copy = Object.assign({}, message);
        copy.body.sender = sender; // Add sender parameter
        // Set the user text
        this.userText.set(sender, message.body.text);
        // Broadcast the message
        this.broadcast(message);
    }
}
exports.Room = Room;
