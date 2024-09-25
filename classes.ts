
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
    participants: User[];
    creation: Date;

    constructor(name: string, owner: User) {
        this.name = name;
        this.owner = owner;

        this.participants = [owner];
        this.creation = new Date();
    }
}