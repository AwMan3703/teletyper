import * as crypto from "crypto";
import {Room, User} from "./classes";
import {liveRooms, liveUsers} from "./data";


export function getUUID() {
    return crypto.randomUUID()
}

const IDs: string[] = []
export function getID(length: number, iteration: number = 0) {
    const max_iterations = 500
    if (iteration > max_iterations) { throw new Error(`Could not generate a unique ID in ${max_iterations} iterations`) }

    let result: string | string[] = [];
    const characters = '' +
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
        'abcdefghijklmnopqrstuvwxyz' +
        '0123456789';
    const charactersLength= characters.length;
    for (let i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    result = result.join('');

    // If the ID was already generated, get a new one
    if (IDs.includes(result)) { return getID(length, iteration + 1) }
    // If the ID is unique, return it
    else { return result }
}

export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

export function isUsernameValid(username: string) {
    return username.length > 0 && username.length < 21;
}

export function isUsernameAvailable(username: string) {
    return !liveUsers.find(user => user.username.toLowerCase() === username.toLowerCase());
}

export function createUser(username: string): User {
    const user = new User(username)

    liveUsers.push(user)

    return user
}

export function deleteUser(user: User): void {
    const room = liveRooms.find(room => room.get_participants.includes(user))
    if (room) { room.user_disconnect(user) }

    liveUsers.splice(liveUsers.indexOf(user), 1)
}

export function isRoomNameValid(room_name: string) {
    return room_name.length > 0 && room_name.length < 21;
}

export function isRoomNameAvailable(room_name: string) {
    return !liveRooms.find(room => room.name === room_name)
}

export function createRoom(name: string | null, owner: User, max_participants?: number, invite_only?: boolean, password?: string): Room {
    if (!name) { name = `${owner.username}'s room #${getID(4)}` }
    const room = new Room(name, owner, max_participants, invite_only || false, password || "")

    liveRooms.push(room)

    room.user_join(owner)

    return room
}

export function deleteRoom(room: Room) {
    room.get_participants.forEach(participant => {
        deleteUser(participant)
    })

    liveRooms.splice(liveRooms.indexOf(room), 1)
}