"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle_room_message = handle_room_message;
const data_1 = require("./data");
const utility_1 = require("./utility");
/*
* SEND MESSAGES VIA WEBSOCKET - Parameters that are always required (see websocket_server.ts)
* - token: the user's session token
*/
function handle_room_message(message, sender, client_socket) {
    var _a;
    // Check that a target room (one in which the user is participating) exists
    const target_room = data_1.liveRooms.find(room => room.get_participants.includes(sender));
    if (!target_room) {
        console.error(`User ${sender.username} sent a message but is not a participant in any room`);
        return;
    }
    switch (message.type) {
        case "confirm_registration":
            // Check that the user has a websocket
            if (!sender.websocket) {
                console.warn(`Could not catch ${sender.username} up: user has no bound WebSocket`);
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
        case 'room-event_user-expel':
            if (sender !== target_room.owner) {
                console.log(`${sender.username} tried to expel a participant without being the room owner`);
                return;
            }
            // Propagate event and expel user
            const target = data_1.liveUsers.find(user => user.uuid === message.body.target_user);
            if (!target) {
                return;
            }
            console.log(`${sender.username} has expelled ${target === null || target === void 0 ? void 0 : target.username}`);
            (_a = target.websocket) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify({
                type: 'room-event_user-expel',
                body: { reason: message.body.reason },
            }));
            (0, utility_1.deleteUser)(target);
            return;
    }
}
