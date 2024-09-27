"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = open_public_pages;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const stringSimilarity = __importStar(require("string-similarity"));
const public_directory = './public';
function open_public_pages(app) {
    // Serve static files from the public directory
    app.use(express_1.default.static(path_1.default.join(__dirname, public_directory)));
    // Serve an error page if no route is matched
    app.use((req, res) => {
        // Get the original URL
        const requestedURL = req.originalUrl;
        // Find best matching page in the public directory                    get all public contents          filter for file names, not directories
        const bestMatch = stringSimilarity.findBestMatch(requestedURL, fs_1.default.readdirSync(public_directory).filter(name => name.includes('.'))).bestMatch.target;
        // Log to help debug
        console.log(`404 error for "${requestedURL}". Redirecting to 404 page, suggesting "./${bestMatch}".`);
        // Pass URL parameters to dynamically update the page
        res.redirect(`/404.html?url=${encodeURIComponent(requestedURL)}&bm=${encodeURIComponent(bestMatch)}`);
    });
}
