"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatroomID = void 0;
exports.getID = getID;
function getID(length) {
    let result = [];
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
}
const getChatroomID = () => { return getID(8); };
exports.getChatroomID = getChatroomID;
