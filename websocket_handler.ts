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
            // Check that a target room exists
            const target_room = liveRooms.find(room => room.get_participants.includes(sender))
            if (!target_room) { console.error(`Room with id=${message.body.room_id} does not exist`); return }

            // Send typing updates to peers
            console.log(`Message from @${sender.username} to room ${message.body.room_id}!`);
            target_room.message(sender, message)
    }
}