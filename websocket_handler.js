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
            // Check that message has a room id
            if (!message.body.room_id) {
                console.error(`Room message has no target room id`);
                return;
            }
            // Check that target room exists
            const target_room = data_1.liveRooms.find(room => room.id === message.body.room_id);
            if (!target_room) {
                console.error(`Room with id=${message.body.room_id} does not exist`);
                return;
            }
            // Check that user is a participant
            if (!target_room.get_participants.includes(sender)) {
                console.error(`@${sender} sent a message to room ${message.body.room_id} without being a participant`);
                return;
            }
            // Send typing updates to peers
            target_room.message(sender, message);
    }
}
