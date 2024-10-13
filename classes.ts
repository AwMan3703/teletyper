import WebSocket from 'ws';
import {clamp, deleteRoom, getID, getUUID} from "./utility";

// User (client)
export class User {
    public readonly username: string;
    public readonly uuid: string;
    #websocket: WebSocket | undefined = undefined;
    public get websocket(): WebSocket | undefined { return this.#websocket }
    public set websocket(ws: WebSocket) { this.#websocket = ws; this.onWebSocketChange(ws) }
    public onWebSocketChange: (ws: WebSocket) => void = _ => {}; // Callback for when the websocket is set
    // DO NOT LEAK THIS
    public readonly sessionToken: string; // Used to validate WebSocket messages

    constructor(username: string) {
        this.username = username;

        this.uuid = getID(20);
        this.sessionToken = getUUID();
    }

    toJSON() {
        return {
            username: this.username,
            uuid: this.uuid,
        }
    }
}

// A room for live texting
export class Room {
    // User-chosen room name
    public readonly name: string;
    // Server-generated room id
    public readonly id: string;
    public readonly owner: User;
    private participants: User[] = [];
    public get get_participants(): User[] { return [...this.participants]; }
    public readonly max_participants: number;
    public readonly creation: Date;
    public readonly invite_only: boolean;
    public readonly password: string;

    // Store users' live-typer contents
    public readonly userText: Map<User, string>  = new Map<User, string>();

    constructor(name: string, owner: User, max_participants?: number, invite_only?: boolean, password?: string) {
        this.name = name;
        this.owner = owner;
        this.max_participants = clamp(max_participants || 5, 1, 10);
        this.invite_only = invite_only || false;
        this.password = password || '';

        this.id = getID(6);
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
        }
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
        // Add the user
        this.participants.push(user);
        this.participants = this.participants.filter(user => user)

        // Add user content
        this.userText.set(user, '')

        // Broadcast join event
        this.broadcast({
            type: "room-event_user-join",
            body: {user: user}
        })

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
                }))
            })
        }
    }

    public user_disconnect(user: User) {
        // Remove the user
        this.participants.splice(this.participants.indexOf(user), 1);
        this.participants = this.participants.filter(user => user)

        // Remove user content
        this.userText.delete(user)

        // Broadcast disconnect event
        this.broadcast({
            type: "room-event_user-leave",
            body: {user: user}
        })

        // If nobody is left, delete the room
        if (this.participants.length < 1) {
            console.log(`Room ${this.id} is empty and is being deleted`)
            deleteRoom(this)
        }
    }

    public message(sender: User, message: WebSocketMessage) {
        // Copy the message
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