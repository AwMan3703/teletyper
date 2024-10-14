import {Room, User} from "./classes";
import {createRoom, createUser} from "./utility";


// Keep track of connected users
export const liveUsers: User[] = []

// Create server user
const server_user = createUser("server")

// Keep track of currently open rooms
export const liveRooms: Room[] = []
createRoom('Public-1', server_user, 10)
createRoom('Public-2', server_user, 10)
createRoom('Public-3', server_user, 10)
liveRooms.forEach(room => {
    room.message(server_user, {
        token: server_user.sessionToken,
        type: "room_message",
        body: {text: `Welcome to ${room.name}! This is a public room, please be nice :)`}
    })
})