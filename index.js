"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const static_server_1 = __importDefault(require("./static_server"));
const endpoint_server_1 = __importDefault(require("./endpoint_server"));
const websocket_server_1 = __importDefault(require("./websocket_server"));
const websocket_handler_1 = require("./websocket_handler");
const app = (0, express_1.default)();
const port = 3000;
const websocket_port = 8080;
// WEBSOCKET SERVER
// Connects chatters through websockets
(0, websocket_server_1.default)(websocket_port, websocket_handler_1.handle_room_message);
// DATA SERVER
// Serves JSON data
(0, endpoint_server_1.default)(app);
// APP SERVER
// Serves html pages
(0, static_server_1.default)(app);
// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log('Server is live!');
    console.log(`Connect at http://localhost:${port}/`);
});
