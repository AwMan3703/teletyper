import {Room, User} from "./classes";


// Keep track of currently open rooms
export const liveRooms: Room[] = [
    new Room('test-room', new User('test-user'))
]