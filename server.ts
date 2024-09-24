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

app.get("/live-rooms", (req: express.Request, res: express.Response) => {
    res.send(liveRooms);
})


// APP SERVER
// Serves html pages

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, public_directory)));

// Optional: Serve an error page if no route is matched
app.use((req, res) => {
    // Get the original URL
    const requestedURL = req.originalUrl

    // Find best matching page in the public directory
    const bestMatch = stringSimilarity.findBestMatch(requestedURL, fs.readdirSync(public_directory)).bestMatch.target

    // Log to help debug
    console.log(`404 error for ${requestedURL}. Redirecting to 404 page.`);

    res.redirect(`/404.html?url=${encodeURIComponent(requestedURL)}&bm=${encodeURIComponent(bestMatch)}`);
});

// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log('Server is live!')
    console.log(`Access at http://localhost:${port}/`);
});