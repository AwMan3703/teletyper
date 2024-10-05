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

    // Store users' live-typer contents
    public readonly userText: Map<User, string>;

    constructor(name: string, owner: User, max_participants: number = 5, invite_only: boolean = false, password: string = "") {
        this.name = name;
        this.owner = owner;
        this.max_participants = max_participants;
        this.invite_only = invite_only;
        this.password = password;

        this.id = getID(8);
        this.participants = [owner];
        this.creation = new Date();
        this.userText = new Map<User, string>()
    }

    private broadcast(message: any) {
        // For each participant
        this.participants.forEach(participant => {
            if (!participant.websocket) { return }
            // Send the message
            participant.websocket.send(JSON.stringify(message))
        })
    }

    public user_join(user: User) {
        this.participants.push(user);
        this.participants = this.participants.filter(user => user)

        // Add user content
        this.userText.set(user, '')

        // Broadcast join event
        this.broadcast({
            type: "room-event_user-join",
            body: {user: user}
        })
    }

    public user_disconnect(user: User) {
        this.participants.splice(this.participants.indexOf(user), 1);
        this.participants = this.participants.filter(user => user)

        // Remove user content
        this.userText.delete(user)

        // Broadcast disconnect event
        this.broadcast({
            type: "room-event_user-leave",
            body: {user: user}
        })
    }

    public message(sender: User, message: WebSocketMessage) {
        const copy = {...message}
        copy.body.sender = sender // Add sender parameter

        // Set the user text
        this.userText.set(sender, message.body.text)

        // Broadcast the message
        this.broadcast(message)
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