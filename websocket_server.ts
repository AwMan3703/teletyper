import WebSocket from "ws";


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
                const message = JSON.parse(data.toString())

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
        })
    })
}