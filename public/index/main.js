"use strict";
const liveChatsList = document.getElementById("live-chats-list");
const liveChatElementTemplate = document.getElementById("live-chat-template");
function _new_liveChatElement(room) {
    // @ts-ignore
    const node = liveChatElementTemplate.content.cloneNode(true);
    const title = node.querySelector(".chat-title");
    const participants_counter = node.querySelector(".chat-participants-counter");
    const creation_date = node.querySelector(".chat-creation-time");
    const join_button = node.querySelector(".chat-connect-button");
    title.innerText = room.name;
    participants_counter.innerText = `${room.participants.length}/${room.max_participants}`;
    creation_date.innerText = new Date(room.creation).toLocaleTimeString();
    join_button.onclick = function () {
        const params = new URLSearchParams();
        params.set('room-id', room.id);
        window.location.href = `join.html?${params.toString()}`;
    };
    return node;
}
const updateLiveChatList = () => {
    fetch('/live-rooms')
        .then(response => {
        // Check if the response is OK (status code in the range 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Parse JSON data
    })
        .then(data => {
        data.forEach((room) => {
            // @ts-ignore
            liveChatsList.append(_new_liveChatElement(room));
        });
    })
        .catch(error => {
        console.error('Error updating live chats list:', error);
    });
};
updateLiveChatList();
