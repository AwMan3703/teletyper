import {Room, User} from "./classes";

const server_user = new User("server")


// Keep track of currently open rooms
export const liveRooms: Room[] = [
    new Room('test-room-1', server_user),
    new Room('test-room-2', server_user),
    new Room('test-room-3', server_user, undefined, true, 'pass123'),
    new Room('test-room-4', server_user),
    new Room('test-room-5', server_user),
    new Room('test-room-6', server_user, undefined, true, 'ciaoABC'),
    new Room('test-room-7', server_user),
    new Room('test-room-8', server_user),
    new Room('test-room-9', server_user, undefined, true, '0000')
]

// Keep track of connected users
export const liveUsers: User[] = []

const tpr = liveRooms[2] // Expose a private room for testing
console.log("Testing private room:", tpr.id, tpr.password)