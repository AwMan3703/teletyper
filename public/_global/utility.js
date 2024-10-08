"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function setValidityClass(element, is_valid) {
    const c = element.classList;
    if (is_valid) {
        c.add('valid');
        c.remove('invalid');
    }
    else {
        c.add('invalid');
        c.remove('valid');
    }
}
function validateInput(input, events, validator) {
    events.forEach(event => {
        input.addEventListener(event, (_) => __awaiter(this, void 0, void 0, function* () { setValidityClass(input, yield validator(input.value)); }));
    });
}
// @ts-ignore
function fetchRoomData(room_id, room_password) {
    return __awaiter(this, void 0, void 0, function* () {
        if (room_id.length !== 6) {
            throw new Error('Room ID is invalid');
        }
        const params = new URLSearchParams();
        if (room_password)
            params.set('password', room_password);
        const response = yield fetch(`rooms/data/${room_id}?${params.toString()}`);
        if (!response) {
            throw new Error(`No response`);
        }
        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
        }
        return response;
    });
}
