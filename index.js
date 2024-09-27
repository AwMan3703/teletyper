"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const endpoint_server_1 = __importDefault(require("./endpoint_server"));
const static_server_1 = __importDefault(require("./static_server"));
const app = (0, express_1.default)();
const port = 3000;
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
