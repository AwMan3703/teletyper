
const liveChatsList = document.getElementById("live-chats-list");
const liveChatElementTemplate = document.getElementById("live-chat-template");


function _new_liveChatElement(room: any) {
    // @ts-ignore
    const node = liveChatElementTemplate.content.cloneNode(true)

    const title = node.querySelector(".chat-title")
    const id = node.querySelector(".chat-id")
    const participants_counter = node.querySelector(".chat-participants-counter")
    const creation_date = node.querySelector(".chat-creation-time")
    const owner = node.querySelector(".chat-owner")
    const join_button = node.querySelector(".chat-connect-button")

    title.innerText = room.name
    id.innerText = room.id
    participants_counter.innerText = `${room.participants.length}/${room.max_participants}`
    creation_date.innerText = new Date(room.creation).toLocaleTimeString()
    owner.innerText = room.owner.username

    id.onclick = function () {
        navigator.clipboard.writeText(room.id)
            .then(_ => alert('Copied to clipboard!'))
    }
    join_button.onclick = function () {
        const params = new URLSearchParams();
        params.set('room-id', room.id);
        window.location.href = `join.html?${params.toString()}`
    }

    return node
}

const updateLiveChatList = () => {
    fetch('/live-rooms')
        .then(response => {
            // Check if the response is OK (status code in the range 200-299)
            if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
            return response.json(); // Parse JSON data
        })
        .then(data => {
            data.sort((a:{creation:string}, b:{creation:string}) => Date.parse(b.creation) - Date.parse(a.creation))
            data.forEach((room: any) => {
                // @ts-ignore
                liveChatsList.append(_new_liveChatElement(room))
            })
        })
        .catch(error => {
            console.error('Error updating live chats list:', error);
        });
}


updateLiveChatList();

// I may be stupid
if (Math.random() === 0) {
    const logo = document.getElementById('logo')
    let counter = 0
    setInterval((_: any) => {
        // @ts-ignore
        logo.style.rotate = `${counter}deg`
        if (counter >= 360) counter = 0
        counter += 5
    }, 25)
}
