import WebSocket, {WebSocketServer} from "ws";
import {liveRooms} from "./roomManager";


export default function open_websocket_server(websocket_port: number) {
    const server = new WebSocketServer({port: websocket_port});

    server.on('connection', (client_socket: WebSocket) => {
        // Handle socket errors
        client_socket.on('error', (error: Error) => {
            console.error(error);
        })

        client_socket.on('message', (data) => {
            // Handle message data
        })
    })
}