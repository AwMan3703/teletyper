"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = open_websocket_server;
const ws_1 = __importDefault(require("ws"));
function open_websocket_server(websocket_port) {
    const server = new ws_1.default.Server({ port: websocket_port });
    server.on('connection', (client_socket) => {
        console.log('New websocket connection');
        // Handle socket errors
        client_socket.on('error', (error) => {
            console.error(error);
        });
        // Handle message data
        client_socket.on('message', (data) => {
            try {
                const message = JSON.parse(data.toString());
                handle_message(message);
            }
            catch (error) {
                console.log(`Error parsing websocket message: ${error}`);
            }
        });
    });
}
function handle_message(message) {
    switch (message.type) {
        case 'JOIN':
        // Setup, assign username and room to client, broadcast join event to peers
        case 'MESSAGE':
        // Send typing updates to peers
        case 'LEAVE':
        // Disconnect user and broadcast disconnect event to peers
    }
}
