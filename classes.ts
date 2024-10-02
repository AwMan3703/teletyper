import WebSocket from 'ws';
import {getChatroomID, getUUID} from "./utility";

// User (client)
export class User {
    public readonly username: string;
    public readonly private_uuid: string; // Unique user identifier, known only by the user's client and server
    public readonly public_uuid: string; // Unique user identifier, public
    public websocket: WebSocket | undefined;

    constructor(username: string) {
        this.username = username;
        this.websocket = undefined;

        this.private_uuid = getUUID()
        this.public_uuid = getUUID()
    }
}

// A room for live texting
export class Room {
    // User-chosen room name
    public readonly name: string;
    // Server-generated room id
    public readonly id: string;
    public readonly owner: User;
    public readonly participants: User[];
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

        this.id = getChatroomID(); //crypto.randomUUID();
        this.participants = [owner];
        this.creation = new Date();
    }

    public user_join(user: User) {
        this.participants.push(user);
    }

    public user_disconnect(user: User) {
        this.participants.splice(this.participants.indexOf(user), 1);
    }

    public message(sender: User) {
        this.participants.forEach(user => {

        })
    }
}

// Message classes
export interface WebSocketMessage {
    readonly type: 'room_message';
    readonly private_uuid: string; // Used to authenticate user
    readonly body: any;
}