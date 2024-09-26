import express from 'express';
import path from 'path';
import fs from 'fs';
import * as stringSimilarity from 'string-similarity';
import {liveRooms} from "./roomManager"

const app = express();
const port = 3000;
const public_directory = './public'


// DATA SERVER
// Define data endpoints here

// Live chat rooms list
app.get("/live-rooms", (req: express.Request, res: express.Response) => {
    const publicRooms = liveRooms.filter(room => !room.invite_only)
    res.send(publicRooms);
})

// Chat room data (:roomid is the room id passed by the client, just found out you can do that and i love it)
app.get("/room-data/:roomid", (req: express.Request, res: express.Response) => {
    const publicRooms = liveRooms.filter(room => !room.invite_only)
    const matchingRooms = publicRooms.filter(room => room.id === req.params.roomid)
    const room = matchingRooms.length > 0 ? matchingRooms[0] : null;
    if (room) {
        res.send(room);
    } else {
        res.status(404).send({ error: 'Chatroom does not exist' });  // 404 Not Found
    }
})


// APP SERVER
// Serves html pages

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, public_directory)));

// Serve an error page if no route is matched
app.use((req: express.Request, res: express.Response) => {
    // Get the original URL
    const requestedURL = req.originalUrl

    // Find best matching page in the public directory                    get all public contents          filter for file names, not directories
    const bestMatch = stringSimilarity.findBestMatch(requestedURL, fs.readdirSync(public_directory).filter(name => name.includes('.'))).bestMatch.target

    // Log to help debug
    console.log(`404 error for ${requestedURL}. Redirecting to 404 page, suggesting "./${bestMatch}".`);

    // Pass URL parameters to dynamically update the page
    res.redirect(`/404.html?url=${encodeURIComponent(requestedURL)}&bm=${encodeURIComponent(bestMatch)}`);
});

// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log('Server is live!')
    console.log(`Connect at http://localhost:${port}/`);
});