
// User (client)
export class User {
    username: string;

    constructor(username: string) {
        this.username = username;
    }
}

// A room for live texting
export class Room {
    name: string;
    owner: User;

    constructor(name: string, owner: User) {
        this.name = name;
        this.owner = owner;
    }
}