import WebSocket from 'ws';
import {User, WebSocketMessage} from "./classes";
import {liveRooms} from "./data";


/*
* SEND MESSAGES VIA WEBSOCKET - Parameters that are always required (see websocket_server.ts)
* - private_uuid: the user's private uuid
*/


export function handle_room_message(message: WebSocketMessage, sender: User, client_socket: WebSocket) {
    switch (message.type) {
        case 'room_message':
            // Check that message has a room id
            if (!message.body.room_id) { console.error(`Room message has no target room id`); return }
            // Check that target room exists
            const target_room = liveRooms.find(room => room.id === message.body.room_id)
            if (!target_room) { console.error(`Room with id=${message.body.room_id} does not exist`); return }
            // Check that user is a participant
            if (!target_room.get_participants.includes(sender)) { console.error(`@${sender} sent a message to room ${message.body.room_id} without being a participant`); return }

            // Send typing updates to peers
            target_room.message(sender, message)
    }
}