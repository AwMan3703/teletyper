"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = open_websocket_server;
const ws_1 = __importDefault(require("ws"));
const roomManager_1 = require("./roomManager");
function open_websocket_server(websocket_port, handler) {
    const server = new ws_1.default.Server({ port: websocket_port });
    server.on('connection', (client_socket) => {
        console.log('New websocket connection');
        // Handle socket errors
        client_socket.on('error', (error) => {
            console.error(error);
        });
        // Handle message data
        client_socket.on('message', (message) => {
            try {
                // Parse into JSON
                const data = JSON.parse(message.toString());
                // If not already done, map this websocket to its user:
                // Check that the user exists, if not error
                const sender = roomManager_1.liveUsers.find(user => user.private_uuid === data.private_uuid);
                if (!sender) {
                    console.error(`User with private_uuid=${data.private_uuid} does not exist!`);
                    return;
                }
                // Check that the user has no associated websocket, if so, bind it to this one
                else if (!sender.websocket) {
                    console.log(`Registering websocket for user ${sender.username}`);
                    sender.websocket = client_socket;
                }
                // Pass the message to the provided handler
                handler(message, sender, client_socket);
            }
            catch (error) {
                console.log(`Error parsing websocket message: ${error}`);
            }
        });
        // Handle socket close
        client_socket.on('close', () => {
            console.log('Websocket disconnected — unregistering user');
            const user = roomManager_1.liveUsers.find(user => user.websocket === client_socket);
            if (!user) {
                return;
            }
            const room = roomManager_1.liveRooms.find(room => room.participants.includes(user));
            if (!room) {
                return;
            }
            room.user_disconnect(user);
            roomManager_1.liveUsers.splice(roomManager_1.liveUsers.indexOf(user), 1);
        });
    });
}
