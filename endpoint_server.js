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
    app.get("/check/username/:username", (req, res) => {
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
    // Room name validation
    // checks whether a room name is valid and available
    /* Parameters:
    * - roomname (in the URL): the room name to check
    */
    app.get("/check/room-name/:roomname", (req, res) => {
        if (!req.params.roomname) { // 400 Bad request
            res.status(400).send({ error: 'Malformed request' });
            return;
        }
        if (!(0, utility_1.isRoomNameValid)(req.params.roomname)) { // 406 Not acceptable
            res.status(406).send({ error: `Room name "${req.params.roomname}" is not valid` });
            return;
        }
        if (!(0, utility_1.isRoomNameAvailable)(req.params.roomname)) { // 409 Conflict
            res.status(409).send({ error: 'Room name is currently taken' });
            return;
        }
        res.status(200).send();
    });
    // Session token validation
    // checks whether a session token is registered and can be used to send WebSocket messages
    /* Parameters:
    * - sessiontoken (in the URL): the session token to check
    */
    app.get("/check/session-token/:sessiontoken", (req, res) => {
        if (!req.params.sessiontoken) { // 400 Bad request
            res.status(400).send({ error: 'Malformed request' });
            return;
        }
        if (!data_1.liveUsers.find(user => user.sessionToken === req.params.sessiontoken)) { // 404 Not found — perhaps 410 Gone?
            res.status(404).send({ error: 'Session token is not valid' });
            return;
        }
        res.status(200).send();
    });
    // Live chat rooms list
    // returns a list of currently open and public rooms
    /* No parameters */
    app.get("/live-rooms", (req, res) => {
        // Filter for public & non-full rooms
        const validRooms = data_1.liveRooms.filter(room => !room.invite_only && (room.get_participants.length < room.max_participants));
        // 200 OK
        res.status(200).send(validRooms);
    });
    // Chat room data (:roomid is the room id passed by the client, just found out you can do that and I love it)
    // returns data about a selected chatroom
    /* Parameters:
    * - roomid (in the URL): the id of the room to get data about
    * - password (in the query - only if room is private): the room's password
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
        if (room.invite_only && req.query.password !== room.password) { // 401 Access denied
            res.status(401).send({ error: 'Room is invite-only, no password was provided or the password was wrong' });
            return;
        }
        // 200 OK
        res.status(200).send(room);
    });
    // Chat room creation
    // allows for the creation of a new room, then returns it as a JSON object
    /* Parameters:
    * - name (in the URL): the room's name
    * - username (in the query): the name for the user that created the room
    * - maxparticipants (in the query): the room's participant limit
    * - password (in the query - only if the room is private): the room's password
    *    \_ if a password is not provided or is an empty string, the room will be created as public
    */
    app.get("/rooms/create/:name", (req, res) => {
        if (!req.params.name || !req.query.username || !req.query.maxparticipants || !parseInt(req.query.maxparticipants.toString())) { // 400 Bad request
            res.status(400).send({ error: 'Malformed request' });
            return;
        }
        if (!(0, utility_1.isRoomNameValid)(req.params.name)) { // 406 Not acceptable
            res.status(406).send({ error: `Room name "${req.params.name}" is not valid`, fault: 'room-name' });
            return;
        }
        if (!(0, utility_1.isUsernameValid)(req.query.username.toString())) { // 406 Not acceptable
            res.status(406).send({ error: `Username "${req.query.username.toString()}" is not valid`, fault: 'username' });
            return;
        }
        if (!(0, utility_1.isRoomNameAvailable)(req.params.name)) { // 409 Conflict
            res.status(409).send({ error: 'Room name is currently taken', fault: 'room-name' });
            return;
        }
        if (!(0, utility_1.isUsernameAvailable)(req.query.username.toString())) { // 409 Conflict
            res.status(409).send({ error: 'Username is currently taken', fault: 'username' });
            return;
        }
        const max_participants = parseInt(req.query.maxparticipants.toString());
        const invite_only = Boolean(req.query.password);
        const owner = (0, utility_1.createUser)(req.query.username.toString());
        const new_room = (0, utility_1.createRoom)(req.params.name, owner, max_participants, invite_only, (req.query.password || '').toString());
        // 201 Created
        res.status(201).send({ session_token: owner.sessionToken, room_id: new_room.id });
    });
    // Chat room connection
    // allows the client to join a room
    /* Parameters:
    * - roomid (in the URL): the id of the room to join
    * - password (in the query - only if the room is private): the room's password
    * - username (in the query): the username to connect under
    */
    app.get("/rooms/join/:roomid", (req, res) => {
        if (!req.params.roomid || !req.query.username) { // 400 Bad request
            res.status(400).send({ error: 'Malformed request' });
            return;
        }
        const room = data_1.liveRooms.find(room => room.id === req.params.roomid);
        if (!room) { // 404 Not Found
            res.status(404).send({ error: 'Chatroom does not exist' });
            return;
        }
        if (room.get_participants.length >= room.max_participants) { // 410 Gone (the possibility of joining I guess)
            res.status(410).send({ error: `Room is at capacity (${room.get_participants.length}/${room.max_participants} participants)` });
            return;
        }
        if (!(0, utility_1.isUsernameValid)(req.query.username.toString())) { // 406 Not acceptable
            res.status(406).send({ error: `Username "${req.query.username}" is not valid` });
            return;
        }
        if (!(0, utility_1.isUsernameAvailable)(req.query.username.toString())) { // 409 Conflict
            res.status(409).send({ error: 'Username is currently taken' });
            return;
        }
        if (room.invite_only && req.query.password !== room.password) { // 401 Access denied
            res.status(401).send({ error: 'Room is invite-only, no password was provided or the password was wrong' });
            return;
        }
        const new_user = (0, utility_1.createUser)(req.query.username.toString());
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
