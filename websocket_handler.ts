import WebSocket from 'ws';
import {User, WebSocketMessage} from "./classes";
import {liveRooms, liveUsers} from "./data";
import {deleteUser} from "./utility";


/*
* SEND MESSAGES VIA WEBSOCKET - Parameters that are always required (see websocket_server.ts)
* - token: the user's session token
*/


export function handle_room_message(message: WebSocketMessage, sender: User, client_socket: WebSocket) {
    // Check that a target room (one in which the user is participating) exists
    const target_room = liveRooms.find(room => room.get_participants.includes(sender))
    if (!target_room) { console.error(`User ${sender.username} sent a message but is not a participant in any room`); return }

    switch (message.type) {
        case "confirm_registration":
            // Check that the user has a websocket
            if (!sender.websocket) { console.warn(`Could not catch ${sender.username} up: user has no bound WebSocket`); return }

            // Catch the user up on others' text
            target_room.get_participants.forEach(participant => {
                const text = target_room.userText.get(participant)
                if (!text) { return }

                // @ts-ignore (websocket was already checked earlier)
                sender.websocket.send(JSON.stringify({
                    type: "room_message",
                    body: { sender: participant, text: text }
                }))
            })
            return;

        case 'room_message':
            // Send typing updates to peers
            //console.log(`Message from @${sender.username} to room ${target_room.id}!`);
            target_room.message(sender, message)
            return;

        case 'room-event_user-expel':
            if (sender !== target_room.owner) {
                console.log(`${sender.username} tried to expel a participant without being the room owner`)
                return
            }

            // Propagate event and expel user
            const target = liveUsers.find(user => user.uuid === message.body.target_user)
            if (!target) { return }

            console.log(`${sender.username} has expelled ${target?.username}`)

            target.websocket?.send(JSON.stringify({
                type: 'room-event_user-expel',
                body: { reason: message.body.reason },
            }))

            deleteUser(target)

            return
    }
}