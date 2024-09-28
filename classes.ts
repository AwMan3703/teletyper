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

    public user_join(user: User) {

    }

    public user_disconnect(user: User) {

    }

    public message(sender: User) {

    }
}

// Message classes
export class RoomWebSocketMessage { // Base class
    public readonly type: "JOIN" | "MESSAGE";

    constructor(type: "JOIN" | "MESSAGE") {
        this.type = type
    }
}