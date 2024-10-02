import WebSocket from "ws";
import {User, WebSocketMessage} from "./classes";
import {liveRooms, liveUsers} from "./roomManager";


export default function open_websocket_server(websocket_port: number, handler: (message: WebSocketMessage, sender: User, client_socket: WebSocket) => void) {
    const server = new WebSocket.Server({port: websocket_port});

    server.on('connection', (client_socket: WebSocket) => {
        console.log('New websocket connection')

        // Handle socket errors
        client_socket.on('error', (error: Error) => {
            console.error(error);
        })

        // Handle message data
        client_socket.on('message', (message: WebSocketMessage) => {
            try {
                // Parse into JSON
                const data: WebSocketMessage = JSON.parse(message.toString())

                // If not already done, map this websocket to its user:
                // Check that the user exists, if not error
                const sender = liveUsers.find(user => user.private_uuid === data.private_uuid)
                if (!sender) { console.error(`User with private_uuid=${data.private_uuid} does not exist!`); return }
                // Check that the user has no associated websocket, if so, bind it to this one
                else if (!sender.websocket) {
                    console.log(`Registering websocket for user ${sender.username}`)
                    sender.websocket = client_socket
                }

                // Pass the message to the provided handler
                handler(message, sender, client_socket)
            }
            catch (error) {
                console.log(`Error parsing websocket message: ${error}`);
            }
        })

        // Handle socket close
        client_socket.on('close', () => {
            console.log('Websocket disconnected — unregistering user')

            const user = liveUsers.find(user => user.websocket === client_socket)
            if (!user) { return }

            const room = liveRooms.find(room => room.participants.includes(user))
            if (!room) { return }

            room.user_disconnect(user)
            liveUsers.splice(liveUsers.indexOf(user), 1)
        })
    })
}