"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = open_websocket_server;
const ws_1 = require("ws");
function open_websocket_server(websocket_port) {
    const server = new ws_1.WebSocketServer({ port: websocket_port });
    server.on('connection', (client_socket) => {
        // Handle socket errors
        client_socket.on('error', (error) => {
            console.error(error);
        });
        client_socket.on('message', (data) => {
            // Handle message data
        });
    });
}
