import WebSocket from "ws";
import {RoomWebSocketMessage} from "./classes";
import assert from "node:assert";


export default function open_websocket_server(websocket_port: number) {
    const server = new WebSocket.Server({port: websocket_port});

    server.on('connection', (client_socket: WebSocket) => {
        console.log('New websocket connection')

        // Handle socket errors
        client_socket.on('error', (error: Error) => {
            console.error(error);
        })

        // Handle message data
        client_socket.on('message', (data) => {
            try {
                const message: RoomWebSocketMessage = JSON.parse(data.toString())

                handle_message(message)
            }
            catch (error) {
                console.log(`Error parsing websocket message: ${error}`);
            }
        })
    })
}


function handle_message(message: RoomWebSocketMessage) {
    switch (message.type) {
        case 'JOIN':
            // Setup, assign username and room to client, broadcast join event to peers

        case 'MESSAGE':
            // Send typing updates to peers

    }
}