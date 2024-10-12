"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _User_websocket;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = exports.User = void 0;
const utility_1 = require("./utility");
// User (client)
class User {
    get websocket() { return __classPrivateFieldGet(this, _User_websocket, "f"); }
    set websocket(ws) { __classPrivateFieldSet(this, _User_websocket, ws, "f"); this.onWebSocketChange(ws); }
    constructor(username) {
        _User_websocket.set(this, undefined);
        this.onWebSocketChange = _ => { }; // Callback for when the websocket is set
        this.username = username;
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
_User_websocket = new WeakMap();
// A room for live texting
class Room {
    get get_participants() { return [...this.participants]; }
    constructor(name, owner, max_participants, invite_only, password) {
        this.participants = [];
        // Store users' live-typer contents
        this.userText = new Map();
        this.name = name;
        this.owner = owner;
        this.max_participants = (0, utility_1.clamp)(max_participants || 5, 1, 10);
        this.invite_only = invite_only || false;
        this.password = password || '';
        this.id = (0, utility_1.getID)(6);
        this.creation = new Date();
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
        // When the user gets assigned a websocket, catch them up
        user.onWebSocketChange = ws => {
            this.participants.forEach(participant => {
                // @ts-ignore
                user.websocket.send(JSON.stringify({
                    type: "room_message",
                    body: {
                        sender: participant,
                        text: this.userText.get(participant)
                    }
                }));
            });
        };
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
