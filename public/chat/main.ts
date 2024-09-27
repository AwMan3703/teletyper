
const URLparameters = new URLSearchParams(window.location.search);

const roomID = URLparameters.get('roomid')

const chatroomTitle = document.getElementById('chat-title')
const chatroomOwner = document.getElementById('chat-owner')
const chatroomParticipantsCounter = document.getElementById('chat-participant-counter')
const chatroomCreationDate = document.getElementById('chat-creation-date')



function updateRoomData(room: any) {
    // @ts-ignore
    chatroomTitle.innerText = room.name
    // @ts-ignore
    chatroomOwner.innerText = '@' + room.owner.username
    // @ts-ignore
    chatroomParticipantsCounter.innerText = `${room.participants.length}/${room.max_participants}`
    // @ts-ignore
    chatroomCreationDate.innerText = new Date(room.creation).toLocaleTimeString()
}

fetch(`/room-data/${roomID}`)
    .then(response => {
        // Check if the response is OK (status code in the range 200-299)
        if (response.status === 404) {
            // @ts-ignore
            chatroomTitle.innerText = 'Chat room not found'
            throw new Error(`The requested room (${roomID}) likely does not exist`)
        } else if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Parse JSON data
    })
    .then(room => {
        console.log("Chatroom Data:", room);
        document.title = `${room.name} — TeleTyper`
        updateRoomData(room)
    })
    .catch(error => console.error('Error fetching chatroom data:', error));