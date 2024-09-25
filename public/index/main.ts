
const liveChatsList = document.getElementById("live-chats-list");
const liveChatElementTemplate = document.getElementById("live-chats-list-item-template");


function _new_liveChatElement(room) {
    // @ts-ignore
    const node = liveChatElementTemplate.content.cloneNode(true)
    const title = node.querySelector(".chat-title")
    const participants_counter = node.querySelector(".chat-participants-counter")
    const creation_date = node.querySelector(".chat-creation-time")

    title.innerText = `${room.owner.username}'s ${room.name}`
    participants_counter.innerText = room.participants.length
    creation_date.innerText = new Date(room.creation).toLocaleTimeString()

    return node
}

const updateLiveChatList = () => {
    fetch('/live-rooms')
        .then(response => {
            // Check if the response is OK (status code in the range 200-299)
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse JSON data
        })
        .then(data => {
            data.forEach((room) => {
                // @ts-ignore
                liveChatsList.append(_new_liveChatElement(room))
            })
        })
        .catch(error => {
            console.error('Error updating live chats list:', error);
        });
}


updateLiveChatList();