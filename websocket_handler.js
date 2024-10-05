"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle_room_message = handle_room_message;
const data_1 = require("./data");
/*
* SEND MESSAGES VIA WEBSOCKET - Parameters that are always required (see websocket_server.ts)
* - private_uuid: the user's private uuid
*/
function handle_room_message(message, sender, client_socket) {
    // Check that a target room (one in which the user is participating) exists
    const target_room = data_1.liveRooms.find(room => room.get_participants.includes(sender));
    if (!target_room) {
        console.error(`User @${sender.username} sent a message but is not a participant in any room`);
        return;
    }
    switch (message.type) {
        case "confirm_registration":
            // Check that the user has a websocket
            if (!sender.websocket) {
                console.warn(`Could not catch @${sender.username} up: user has no bound WebSocket`);
                return;
            }
            // Catch the user up on others' text
            target_room.get_participants.forEach(participant => {
                const text = target_room.userText.get(participant);
                if (!text) {
                    return;
                }
                // @ts-ignore (websocket was already checked earlier)
                sender.websocket.send(JSON.stringify({
                    type: "room_message",
                    body: { sender: participant, text: text }
                }));
            });
            return;
        case 'room_message':
            // Send typing updates to peers
            //console.log(`Message from @${sender.username} to room ${target_room.id}!`);
            target_room.message(sender, message);
            return;
    }
}
