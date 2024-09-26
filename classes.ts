import {getID, getChatroomID} from "./utility";

// User (client)
export class User {
    username: string;

    constructor(username: string) {
        this.username = username;
    }
}

// A room for live texting
export class Room {
    // User-chosen room name
    name: string;
    // Server-generated room id
    id: string;
    owner: User;
    participants: User[];
    creation: Date;
    invite_only: boolean;

    constructor(name: string, owner: User, invite_only: boolean = false) {
        this.name = name;
        this.owner = owner;
        this.invite_only = invite_only;

        this.id = getChatroomID(); //crypto.randomUUID();
        this.participants = [owner];
        this.creation = new Date();
    }
}