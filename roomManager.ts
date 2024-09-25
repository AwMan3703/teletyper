import {Room, User} from "./classes";


// Keep track of currently open rooms
export const liveRooms: Room[] = [
    new Room('test-room', new User('test-user')),
    new Room('test-room-2', new User('test-user-2'))
]