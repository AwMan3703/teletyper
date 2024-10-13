import {Room, User} from "./classes";

const server_user = new User("server")


// Keep track of currently open rooms
export const liveRooms: Room[] = [
    new Room('test-room-1', server_user),
    new Room('test-room-2', server_user),
    new Room('test-room-3', server_user, undefined, true, 'pass123'),
    new Room('test-room-4', server_user, 10, true, 'ciaoABC'),
]

// Keep track of connected users
export const liveUsers: User[] = []
liveUsers.push(server_user)

const tpr = liveRooms[2] // Expose a private room for testing
console.log("Testing private room:", tpr.id, tpr.password)