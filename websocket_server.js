"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = open_websocket_server;
const ws_1 = __importDefault(require("ws"));
const data_1 = require("./data");
const utility_1 = require("./utility");
const debounceTimeout = 500;
const debounceTimestamps = new Map();
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
                const sender = data_1.liveUsers.find(user => data_1.userTokens.get(user) === data.token);
                if (!sender) {
                    console.error(`User for websocket key "${data.token}" does not exist!`);
                    return;
                }
                // Check that the user has no associated websocket, if so, bind it to this one
                else if (!sender.websocket) {
                    console.log(`Registering websocket for user @${sender.username}`);
                    sender.websocket = client_socket;
                }
                // Debounce messages if they are too frequent
                const sender_debounceTimestamp = debounceTimestamps.get(sender);
                if (sender_debounceTimestamp && (Date.now() - sender_debounceTimestamp) <= debounceTimeout) {
                    return;
                }
                else {
                    debounceTimestamps.set(sender, Date.now());
                }
                // Pass the message to the provided handler
                handler(data, sender, client_socket);
            }
            catch (error) {
                console.log(`Error parsing websocket message: ${error}`);
            }
        });
        // Handle socket close
        client_socket.on('close', () => {
            console.log(`Websocket disconnected`);
            const user = data_1.liveUsers.find(user => user.websocket === client_socket);
            if (!user) {
                console.warn('A WebSocket disconnected, but no user was associated with it');
                return;
            }
            console.log(`Unregistering user @${user.username}`);
            (0, utility_1.deleteUser)(user);
        });
    });
}
