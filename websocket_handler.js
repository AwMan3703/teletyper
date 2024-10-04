"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle_room_message = handle_room_message;
const data_1 = require("./data");
/*
* SEND MESSAGES VIA WEBSOCKET - Parameters that are always required (see websocket_server.ts)
* - private_uuid: the user's private uuid
*/
function handle_room_message(message, sender, client_socket) {
    switch (message.type) {
        case 'room_message':
            // Check that a target room exists
            const target_room = data_1.liveRooms.find(room => room.get_participants.includes(sender));
            if (!target_room) {
                console.error(`Room with id=${message.body.room_id} does not exist`);
                return;
            }
            // Send typing updates to peers
            console.log(`Message from @${sender.username} to room ${message.body.room_id}!`);
            target_room.message(sender, message);
    }
}
