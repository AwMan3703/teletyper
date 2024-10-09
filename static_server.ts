import express from 'express';
import path from 'path';
import fs from 'fs';
import * as stringSimilarity from 'string-similarity';


const public_directory = './public'
const excluded_files = ['.DS_Store', '404.html']

export default function open_public_pages(app: express.Express) {
// Serve static files from the public directory
    app.use(express.static(path.join(__dirname, public_directory)));

// Serve an error page if no route is matched
    app.use((req: express.Request, res: express.Response) => {
        // Get the original URL
        const requestedURL = req.originalUrl

        // Find best matching page in the public directory
        const bestMatch = stringSimilarity.findBestMatch(requestedURL,
            // Get all public content
            fs.readdirSync(public_directory)
                // Filter for file names, not directories
                .filter(name => name.includes('.'))
                // Filter excluded content
                .filter(name => !excluded_files.includes(name)))
            // Get the best match
            .bestMatch.target

        // Log to help debug
        console.log(`404 error for "${requestedURL}". Redirecting to 404 page, suggesting "./${bestMatch}".`);

        // Pass URL parameters to dynamically update the page
        res.redirect(`/404.html?url=${encodeURIComponent(requestedURL)}&bm=${encodeURIComponent(bestMatch)}`);
    });
}