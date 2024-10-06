import * as crypto from "crypto";
import {User} from "./classes";
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

export function isUsernameAvailable(username: string) {
    return !liveUsers.find(user => user.username === username);
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