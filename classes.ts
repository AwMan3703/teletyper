import {getChatroomID} from "./utility";

// User (client)
export class User {
    public readonly username: string;

    constructor(username: string) {
        this.username = username;
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

    constructor(name: string, owner: User, max_participants: number = 5, invite_only: boolean = false) {
        this.name = name;
        this.owner = owner;
        this.max_participants = max_participants;
        this.invite_only = invite_only;

        this.id = getChatroomID(); //crypto.randomUUID();
        this.participants = [owner];
        this.creation = new Date();
    }
}

// Message class
export class RoomWebSocketMessage {
    public readonly type: "JOIN" | "MESSAGE" | "LEAVE";
    public readonly body: string;

    constructor(type: "JOIN" | "MESSAGE" | "LEAVE", body: string) {
        this.type = type
        this.body = body
    }
}