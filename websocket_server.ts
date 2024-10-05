import WebSocket from "ws";
import {User, WebSocketMessage} from "./classes";
import {liveUsers} from "./data";
import {deleteUser} from "./utility";


const debounceTimeout = 500;
const debounceTimestamps = new Map<User, number>()


export default function open_websocket_server(websocket_port: number, handler: (message: WebSocketMessage, sender: User, client_socket: WebSocket) => void) {
    const server = new WebSocket.Server({port: websocket_port});

    server.on('connection', (client_socket: WebSocket) => {
        console.log('New websocket connection')

        // Handle socket errors
        client_socket.on('error', (error: Error) => {
            console.error(error);
        })

        // Handle message data
        client_socket.on('message', (message: any) => {
            try {
                // Parse into JSON
                const data: WebSocketMessage = JSON.parse(message.toString())

                // If not already done, map this websocket to its user:
                // Check that the user exists, if not error
                const sender = liveUsers.find(user => user.sessionToken === data.token)
                if (!sender) { console.warn(`User with session token "${data.token}" does not exist! Was the server rebooted?`); return }
                // Check that the user has no associated websocket, if so, bind it to this one
                else if (!sender.websocket) {
                    console.log(`Registering websocket for user @${sender.username}`)
                    sender.websocket = client_socket
                }

                // Debounce messages if they are too frequent
                const sender_debounceTimestamp = debounceTimestamps.get(sender)
                if (sender_debounceTimestamp && (Date.now() - sender_debounceTimestamp) <= debounceTimeout) { return }
                else { debounceTimestamps.set(sender, Date.now()) }

                // Pass the message to the provided handler
                handler(data, sender, client_socket)
            }
            catch (error) {
                console.log(`Error parsing websocket message: ${error}`);
            }
        })

        // Handle socket close
        client_socket.on('close', () => {
            console.log(`Websocket disconnected`)

            const user = liveUsers.find(user => user.websocket === client_socket)
            if (!user) {
                console.warn('A WebSocket disconnected, but no user was associated with it')
                return
            }

            console.log(`Unregistering user @${user.username}`)

            deleteUser(user)
        })
    })
}