import {Room, User} from "./classes";
import {createRoom} from "./utility";

const server_user = new User("server")


// Keep track of connected users
export const liveUsers: User[] = []
liveUsers.push(server_user)

// Keep track of currently open rooms
export const liveRooms: Room[] = []
createRoom('test-room-1', server_user)
createRoom('test-room-2', server_user)
createRoom('test-room-3', server_user, undefined, true, 'pass123')
createRoom('test-room-4', server_user, undefined, true, 'ciaoABC')


const tpr = liveRooms[2] // Expose a private room for testing
console.log("Testing private room:", tpr.id, tpr.password)