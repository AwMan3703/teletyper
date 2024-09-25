import {Room, User} from "./classes";


// Keep track of currently open rooms
export const liveRooms: Room[] = [
    new Room('test-room-1', new User('test-user-1')),
    new Room('test-room-2', new User('test-user-2')),
    new Room('test-room-3', new User('test-user-3')),
    new Room('test-room-4', new User('test-user-4')),
    new Room('test-room-5', new User('test-user-5')),
    new Room('test-room-6', new User('test-user-6')),
    new Room('test-room-7', new User('test-user-7'))
]