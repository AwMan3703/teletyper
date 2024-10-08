"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = open_endpoints;
const express_1 = __importDefault(require("express"));
const data_1 = require("./data");
const utility_1 = require("./utility");
function open_endpoints(app) {
    app.use(express_1.default.json());
    // Username validation
    // checks whether a username is valid and available
    /* Parameters:
    * - username (in the URL): the username to check
    */
    app.get("/check-username/:username", (req, res) => {
        if (!req.params.username) { // 400 Bad request
            res.status(400).send({ error: 'Malformed request' });
            return;
        }
        if (!(0, utility_1.isUsernameValid)(req.params.username)) { // 406 Not acceptable
            res.status(406).send({ error: `Username "${req.params.username}" is not valid` });
            return;
        }
        if (!(0, utility_1.isUsernameAvailable)(req.params.username)) { // 409 Conflict
            res.status(409).send({ error: 'Username is currently taken' });
            return;
        }
        res.status(200).send();
    });
    // Live chat rooms list
    // returns a list of currently open and public rooms
    /* No parameters */
    app.get("/live-rooms", (req, res) => {
        const publicRooms = data_1.liveRooms.filter(room => !room.invite_only);
        // 200 OK
        res.status(200).send(publicRooms);
    });
    // Chat room data (:roomid is the room id passed by the client, just found out you can do that and i love it)
    // returns data about a selected chatroom
    /* Parameters:
    * - roomid (in the URL): the id of the room to get data about
    * - password (in the body - only if room is private): the room's password
    */
    app.get("/rooms/data/:roomid", (req, res) => {
        if (!req.params.roomid) { // 400 Bad request
            res.status(400).send({ error: 'Malformed request' });
            return;
        }
        const room = data_1.liveRooms.find(room => room.id === req.params.roomid);
        if (!room) { // 404 Not Found
            res.status(404).send({ error: 'Chatroom does not exist' });
            return;
        }
        if (room.invite_only && req.body.password !== room.password) { // 401 Access denied
            res.status(401).send({ error: 'Room is invite-only, no password was provided or the password was wrong' });
            return;
        }
        // 200 OK
        res.status(200).send(room);
    });
    // Chat room connection
    // allows the client to join a room
    /* Parameters:
    * - roomid (in the URL): the id of the room to join
    * - password (in the body - only if the room is private): the room's password
    * - username (in the body): the username to connect under
    */
    app.post("/rooms/join/:roomid", (req, res) => {
        if (!req.params.roomid || !req.body.username) { // 400 Bad request
            res.status(400).send({ error: 'Malformed request' });
            return;
        }
        const room = data_1.liveRooms.find(room => room.id === req.params.roomid);
        if (!room) { // 404 Not Found
            res.status(404).send({ error: 'Chatroom does not exist' });
            return;
        }
        if (!(0, utility_1.isUsernameValid)(req.body.username)) { // 406 Not acceptable
            res.status(406).send({ error: `Username "${req.body.username}" is not valid` });
            return;
        }
        if (!(0, utility_1.isUsernameAvailable)(req.body.username)) { // 409 Conflict
            res.status(409).send({ error: 'Username is currently taken' });
            return;
        }
        if (room.invite_only && req.body.password !== room.password) { // 401 Access denied
            res.status(401).send({ error: 'Room is invite-only, no password was provided or the password was wrong' });
            return;
        }
        const new_user = (0, utility_1.createUser)(req.body.username);
        room.user_join(new_user);
        // 202 Accepted
        res.status(202).send({ session_token: new_user.sessionToken });
        // Delete the user if it is not bound to a websocket within X seconds
        const confirmationTimeout = 10;
        setTimeout(() => {
            // If the user was bound to a websocket, ignore
            if (new_user.websocket) {
                return;
            }
            // If not, delete the user object (client may have crashed, we don't want to lock the username forever)
            console.warn(`User @${new_user.username} was not bound to a WebSocket within ${confirmationTimeout} seconds, so it's being unregistered`);
            (0, utility_1.deleteUser)(new_user);
        }, confirmationTimeout * 1000);
    });
}
