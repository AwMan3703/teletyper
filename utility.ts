import * as crypto from "crypto";
import {User} from "./classes";
import {liveRooms, liveUsers, userTokens} from "./data";


export function getUUID() {
    return crypto.randomUUID()
}

export function getID(length: number) {
    let result = [];
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength= characters.length;
    for (let i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
}

export function isUsernameAvailable(username: string) {
    return !liveUsers.find(user => user.username === username);
}

export function createUser(username: string): [User, string] {
    const user = new User(username)
    const token = getUUID()

    liveUsers.push(user)
    userTokens.set(user, token)

    return [user, token]
}

export function deleteUser(user: User): void {
    const room = liveRooms.find(room => room.get_participants.includes(user))
    if (room) { room.user_disconnect(user) }

    liveUsers.splice(liveUsers.indexOf(user), 1)
}