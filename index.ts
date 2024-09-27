import express from 'express';
import open_endpoints from "./endpoint_server";
import open_public_pages from "./static_server";

const app = express();
const port = 3000;

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