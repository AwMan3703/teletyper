import {Room, User} from "./classes";


// Keep track of currently open rooms
export const liveRooms: Room[] = [
    new Room('test-room-1', new User('test-user-1')),
    new Room('test-room-2', new User('test-user-2')),
    new Room('test-room-3', new User('test-user-3'), undefined, true),
    new Room('test-room-4', new User('test-user-4')),
    new Room('test-room-5', new User('test-user-5')),
    new Room('test-room-6', new User('test-user-6'), undefined, true),
    new Room('test-room-7', new User('test-user-7')),
    new Room('test-room-8', new User('test-user-8')),
    new Room('test-room-9', new User('test-user-9'), undefined, true)
]