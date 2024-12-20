import express from 'express';
import open_public_pages from "./static_server";
import open_endpoints from "./endpoint_server";
import open_websocket_server from "./websocket_server";
import { handle_room_message } from "./websocket_handler"

const app = express();
export const port = 3000;
export const websocket_port = 8080

// WEBSOCKET SERVER
// Connects chatters through websockets
open_websocket_server(websocket_port, handle_room_message)

// DATA SERVER
// Serves JSON data
open_endpoints(app)

// APP SERVER
// Serves html pages
open_public_pages(app)


// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log('Server is live!')
    console.log(`Connect at http://localhost:${port}/`);
});