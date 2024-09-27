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
                switch (message.type) {
                    case 'join_chat':
                    // Setup, assign username and room to client, broadcast join event to peers
                    case 'typing_update':
                    // Send typing updates to peers
                }
            }
            catch (error) {
                console.log(`Error parsing websocket message: ${error}`);
            }
        });
    });
}
