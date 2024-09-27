import express from 'express';
import path from 'path';
import fs from 'fs';
import * as stringSimilarity from 'string-similarity';


const public_directory = './public'

export default function open_public_pages(app: express.Express) {
// Serve static files from the public directory
    app.use(express.static(path.join(__dirname, public_directory)));

// Serve an error page if no route is matched
    app.use((req: express.Request, res: express.Response) => {
        // Get the original URL
        const requestedURL = req.originalUrl

        // Find best matching page in the public directory                    get all public contents          filter for file names, not directories
        const bestMatch = stringSimilarity.findBestMatch(requestedURL, fs.readdirSync(public_directory).filter(name => name.includes('.'))).bestMatch.target

        // Log to help debug
        console.log(`404 error for "${requestedURL}". Redirecting to 404 page, suggesting "./${bestMatch}".`);

        // Pass URL parameters to dynamically update the page
        res.redirect(`/404.html?url=${encodeURIComponent(requestedURL)}&bm=${encodeURIComponent(bestMatch)}`);
    });
}