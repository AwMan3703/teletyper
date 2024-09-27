"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = open_endpoints;
const roomManager_1 = require("./roomManager");
function open_endpoints(app) {
    // Live chat rooms list
    app.get("/live-rooms", (req, res) => {
        const publicRooms = roomManager_1.liveRooms.filter(room => !room.invite_only);
        res.send(publicRooms);
    });
    // Chat room data (:roomid is the room id passed by the client, just found out you can do that and i love it)
    app.get("/room-data/:roomid", (req, res) => {
        const publicRooms = roomManager_1.liveRooms.filter(room => !room.invite_only);
        const matchingRooms = publicRooms.filter(room => room.id === req.params.roomid);
        const room = matchingRooms.length > 0 ? matchingRooms[0] : null;
        if (room) {
            res.send(room);
        }
        else {
            res.status(404).send({ error: 'Chatroom does not exist' }); // 404 Not Found
        }
    });
}
