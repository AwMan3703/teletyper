import WebSocket from 'ws';
import {getID, getUUID} from "./utility";

// User (client)
export class User {
    public readonly username: string;
    public readonly uuid: string;
    public websocket: WebSocket | undefined;

    constructor(username: string) {
        this.username = username;
        this.websocket = undefined;

        this.uuid = getUUID();
    }
}

// A room for live texting
export class Room {
    // User-chosen room name
    public readonly name: string;
    // Server-generated room id
    public readonly id: string;
    public readonly owner: User;
    private participants: User[];
    public get get_participants() { return [...this.participants]; }
    public readonly max_participants: number;
    public readonly creation: Date;
    public readonly invite_only: boolean;
    public readonly password: string;

    constructor(name: string, owner: User, max_participants: number = 5, invite_only: boolean = false, password: string = "") {
        this.name = name;
        this.owner = owner;
        this.max_participants = max_participants;
        this.invite_only = invite_only;
        this.password = password;

        this.id = getID(8);
        this.participants = [owner];
        this.creation = new Date();
    }

    private broadcast(message: {type: string, body: any}) {
        this.participants.forEach(user => {
            if (!user) { return }
            if (!user.websocket) { return }
            user.websocket.send(JSON.stringify({
                private_uuid: `server-room-${this.id}`,
                type: message.type,
                body: message.body
            }))
        })
    }

    public user_join(user: User) {
        this.participants.push(user);
        this.participants = this.participants.filter(user => user)
        this.broadcast({
            type: "room-event_user-join",
            body: {user: user}
        })
    }

    public user_disconnect(user: User) {
        this.participants.splice(this.participants.indexOf(user), 1);
        this.participants = this.participants.filter(user => user)
        this.broadcast({
            type: "room-event_user-leave",
            body: {user: user}
        })
    }

    public message(sender: User, message: WebSocketMessage) {
        const copy = {...message}
        copy.body.sender = sender // Add sender parameter
        this.broadcast(copy)
    }
}

// Message classes
export interface WebSocketMessage {
    readonly type:
        'confirm_registration' // Bind websocket to user — body can be empty
        | 'room_message' // Send a message to the chatroom
        | 'room-event_user-join' // A user has joined the room
        | 'room-event_user-leave' // A user has left the room
    ;
    readonly token: string; // Used to authenticate user
    readonly body: any;
}