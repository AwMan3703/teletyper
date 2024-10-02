import express from 'express';
import {isUsernameAvailable, liveRooms, liveUsers} from './roomManager';
import {User} from "./classes";


export default function open_endpoints(app: express.Express) {
    app.use(express.urlencoded());

    // Live chat rooms list
    // returns a list of currently open and public rooms
    /* No parameters */
    app.get("/live-rooms", (req: express.Request, res: express.Response) => {
        const publicRooms = liveRooms.filter(room => !room.invite_only)

        // 200 OK
        res.status(200).send(publicRooms);
    })

    // Chat room data (:roomid is the room id passed by the client, just found out you can do that and i love it)
    // returns data about a selected chatroom
    /* Parameters:
    * - roomid (in the url): the id of the room to get data about
    * - password (in the body - only if room is private): the room's password
    */
    app.get("/rooms/data/:roomid", (req: express.Request, res: express.Response) => {
        const room = liveRooms.find(room => room.id === req.params.roomid)
        if (!room) { // 404 Not Found
            res.status(404).send({error: 'Chatroom does not exist'});
            return
        }
        if (room.invite_only && req.body.password !== room.password) { // 401 Access denied
            res.status(401).send({error: 'Room is invite-only, no password was provided or the password was wrong'});
            return
        }

        // 200 OK
        res.status(200).send(room);
    })

    // Chat room connection
    // allows the client to join a room
    /* Parameters:
    * - roomid (in the url): the id of the room to join
    * - password (in the body - only if the room is private): the room's password
    * - username (in the body): the username to connect under
    */
    app.post("/rooms/join/:roomid", (req: express.Request, res: express.Response) => {
        const room = liveRooms.find(room => room.id === req.params.roomid)
        if (!room) { // 404 Not Found
            res.status(404).send({error: 'Chatroom does not exist'});
            return
        }
        if (!req.body.username) { // 400 Bad request
            res.status(400).send({error: 'Username is required'});
        }
        if (!isUsernameAvailable(req.body.username)) { // 409 Conflict
            res.status(409).send({error: 'Username is currently taken'});
            return
        }
        if (room.invite_only && req.body.password !== room.password) { // 401 Access denied
            res.status(401).send({error: 'Room is invite-only, no password was provided or the password was wrong'});
            return
        }

        const new_user = new User(req.body.username);
        const new_user_index = liveUsers.push(new_user)
        room.user_join(liveUsers[new_user_index])

        // 202 Accepted
        res.status(202).send({private_uuid: new_user.private_uuid});
    })
}