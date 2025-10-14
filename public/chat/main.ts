
// VARIABLES

// @ts-ignore
let SESSION_TOKEN: string = localStorage.getItem('session-token')
const WEBSOCKET_PORT = 8080

//const debounceTimeout = 500 // Timeout for live typing updates (in ms)
//let lastDebounceTimestamp = Date.now()

// @ts-ignore
const URLParameters = new URLSearchParams(window.location.search);
const roomID = URLParameters.get('room-id')
const roomPassword = URLParameters.get('room-password')
const username = URLParameters.get('username')

let AM_I_OWNER = false

const chatroomTitle = document.getElementById('chat-title')
const chatroomOwner = document.getElementById('chat-owner')
const chatroomParticipantsCounter = document.getElementById('chat-participant-counter')
const chatroomCreationDate = document.getElementById('chat-creation-date')

const liveTypersList = document.getElementById('live-typers-list')
const liveTyperTemplate = document.getElementById('live-typer-template')

const typerInput = document.getElementById('chat-input')
const clearButton = document.getElementById('clear-button')
const backButton = document.getElementById('back-button')
const copyButton = document.getElementById('copy-link-button')


// FUNCTIONS

const liveTyperID = (user_uuid: string) => `liveTyper_${user_uuid}`
const getLiveTyperOutput = (user_uuid: string) => document.getElementById(`liveTyper_${user_uuid}`)?.querySelector('.live-typer-content')

function liveTyperScrollDown(user_uuid: string) {
    const lt = getLiveTyperOutput(user_uuid)
    // @ts-ignore
    lt.scrollTop = lt.scrollHeight
}

function liveTyperFlash(user_uuid: string) {
    const lt = document.getElementById(liveTyperID(user_uuid))
    // @ts-ignore
    lt.classList.remove('update-flash')
    // @ts-ignore
    lt.getAnimations().forEach(a => { a.cancel() })
    // @ts-ignore
    lt.classList.add('update-flash')
    // @ts-ignore
    lt.addEventListener('animationend', _ => { lt.classList.remove('update-flash') })
}

function _new_liveTyperElement(user: {uuid: string, username: string}) {
    // @ts-ignore
    const node = liveTyperTemplate.content.cloneNode(true)
    node.firstElementChild.id = liveTyperID(user.uuid)

    const usernameField = node.querySelector(".live-typer-username")
    const expelButton = node.querySelector(".expel-button")

    usernameField.innerText = user.username
    if (AM_I_OWNER && user.username !== `@${username}`) {
        expelButton.dataset.target = user.uuid
        // @ts-ignore
        expelButton.onclick = _ => {
            console.log(`Expelling user ${expelButton.dataset.target}`)
            sendWebSocketMessage('room-event_user-expel', {
                target_user: expelButton.dataset.target,
                reason: window.prompt('Provide a reason for expelling this user:')
            })
        }
    } else {
        expelButton.remove()
    }

    return node
}

// @ts-ignore
async function fetchRoomData(room_id: string, room_password: string | null) {
    if (room_id.length !== 6) { console.error(`Invalid Room ID "${room_id}"`); return }

    try {
        const params = new URLSearchParams()
        if (room_password) params.set('password', room_password)

        // Fetch and display room data
        const response = await fetch(`/rooms/data/${roomID}?${params.toString()}`)
        // Check if the response is OK (status code in the range 200-299)
        if (response.status === 404) {
            // @ts-ignore
            chatroomTitle.innerText = 'Room not found'
        } else if (response.status === 401) {
            // @ts-ignore
            chatroomTitle.innerText = 'Wrong/Missing password'
        } else if (399 < response.status && response.status < 500) {
            // @ts-ignore
            chatroomTitle.innerText = 'Something went wrong :/'
        } else if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json()
        console.log("Chatroom Data:", json);
        document.title = `${json.name} — TeleTyper`

        return json
    } catch (error) {
        console.error('Error fetching chatroom data:', error)
    }
}

function updateRoomData(room: any) {
    // @ts-ignore
    chatroomTitle.innerText = room.name
    // @ts-ignore
    chatroomOwner.innerText = room.owner.username
    // @ts-ignore
    chatroomParticipantsCounter.innerText = `${room.participants.length}/${room.max_participants}`
    // @ts-ignore
    chatroomCreationDate.innerText = new Date(room.creation).toLocaleTimeString()
}

function updateLiveTypers(room: any) {
    // @ts-ignore
    liveTypersList.childNodes.forEach(child => child.remove())
    room.participants.forEach((participant: any) => {
        // @ts-ignore
        liveTypersList.appendChild(_new_liveTyperElement(participant))
    })
}

function returnToJoinForm(message: string) {
    const params = new URLSearchParams()
    if (roomID) params.set('room-id', roomID)
    if (roomPassword) params.set('room-password', roomPassword)
    if (username) params.set('username', username)

    if (!(roomID && roomPassword && username)) alert(message)

    window.location.href = `join.html?${params.toString()}`
    throw new Error(message)
}


// SCRIPT

// If no session token is found, bounce back to join form
if (!SESSION_TOKEN || SESSION_TOKEN === '') returnToJoinForm('NO SESSION TOKEN FOUND')

// If a session token is found, GET /check/session-token/:sessiontoken to verify that is still valid
// Otherwise bounce back to join form
fetch(`/check/session-token/${SESSION_TOKEN}`)
    .then(response => {
        if (response.ok) { return }
        returnToJoinForm('SESSION TOKEN IS NOT VALID')
    })

// --- WebSockets --- //

// Open a websocket for communication
const websocketAddress = `ws://${window.location.hostname}:${WEBSOCKET_PORT}`
console.log(`Room WebSocket address is ${websocketAddress}`)
const websocket = new WebSocket(websocketAddress)

// Shorthand because I'm lazy
const sendWebSocketMessage = (type: string, body: any = {}) => {
    websocket.send(JSON.stringify({token: SESSION_TOKEN, type: type, body: body}))
}

// Wait for the websocket to open
websocket.onopen = _ => {
    // Send an empty message to get registered
    sendWebSocketMessage('confirm_registration')

    // Visually confirm that the WebSocket is open
    // @ts-ignore
    setValidityClass(typerInput, true)

    // @ts-ignore
    typerInput.oninput = _ => {
        // @ts-ignore
        let new_content = typerInput.value
        // Debounce — if updates are too frequent, queue the data for the next ones
        /*if ((Date.now() - lastDebounceTimestamp) <= debounceTimeout) { return }
        console.log('Sending live-typer updates')*/
        // Send the new text
        sendWebSocketMessage('room_message', {text: new_content})
        // Reset the debounce counter
        //lastDebounceTimestamp = Date.now()
    }
}
websocket.onclose = _ => {
    // Visually alert that the WebSocket is closed
    // @ts-ignore
    setValidityClass(typerInput, false)
}

// Handle incoming messages
const handleWebSocketMessage = (type: string, message: {type: string, body: any}, handler: (body: any) => void) => { if (type===message.type) {handler(message.body)} }
websocket.onmessage = (e) => {
    const message = JSON.parse(e.data)
    if (message.type.includes('room-event')) { fetchRoomData(roomID || '', roomPassword).then(roomData => updateRoomData(roomData)) }

    // User has joined the room
    handleWebSocketMessage('room-event_user-join', message, (body) => {
        if (!body.user) { console.error('Malformed data: WebSocket message has no user'); return }
        if (!body.user.uuid) { console.error('Malformed data: WebSocket message user has no UUID'); return }
        if (!body.user.username) { console.error('Malformed data: WebSocket message user has no username'); return }
        // @ts-ignore
        liveTypersList.appendChild(_new_liveTyperElement(body.user))
        alert(`${body.user.username} joined the room!`)
    })
    // User has left the room
    handleWebSocketMessage('room-event_user-leave', message, (body) => {
        if (!body.user) { console.error('Malformed data: WebSocket message has no user'); return }
        if (!body.user.uuid) { console.error('Malformed data: WebSocket message user has no UUID'); return }
        if (!body.user.username) { console.error('Malformed data: WebSocket message user has no username'); return }
        // @ts-ignore
        liveTypersList.querySelector(`#${liveTyperID(body.user.uuid)}`).remove()
        alert(`${body.user.username} left the room!`)
    })
    // You have been disconnected
    handleWebSocketMessage('room-event_user-expel', message, (body) => {
        alert(`You have been expelled from this room.${ body.reason ? ` Reason: ${body.reason}` : '' }`)
        window.location.href = 'index.html'
    })
    // Normal message
    handleWebSocketMessage('room_message', message, (body) => {
        if (!body.sender) { console.error('Malformed data: WebSocket message has no sender'); return }
        if (!body.sender.uuid) { console.error('WebSocket message user has no UUID'); return }
        if (!body.text && body.text !== '') { console.error("Malformed data: WebSocket message user has no text"); return }
        console.log(`Updating ${body.sender.username}'s live-typer (${liveTyperID(body.sender.uuid)})`)
        // @ts-ignore
        getLiveTyperOutput(body.sender.uuid).innerText = body.text
        liveTyperScrollDown(body.sender.uuid)
        liveTyperFlash(body.sender.uuid)
    })
}

// Set buttons callback
// @ts-ignore
clearButton.onclick = _ => {
    // @ts-ignore
    if (!typerInput.value || typerInput.value === '') { return }
    // @ts-ignore
    typerInput.value = ''
    sendWebSocketMessage('room_message', {text: ''})
    console.log('Cleared typer')
}
// @ts-ignore
backButton.onclick = _ => {
    window.location.href = 'index.html'
}
// @ts-ignore
copyButton.onclick = _ => {
    try {
        // @ts-ignore
        navigator.clipboard.writeText(roomID).then(_ => alert('Copied to clipboard!'))
    } catch (err) {
        alert(`Could not copy to clipboard: ${err}`)
    }
}

// Initial data fetch
fetchRoomData(roomID || '', roomPassword)
    .then(roomData => {
        AM_I_OWNER = roomData.owner.username === `@${username}`
        console.log(`User is ${!AM_I_OWNER ? 'not ' : ''}the room owner`)
        updateRoomData(roomData)
        updateLiveTypers(roomData)
    })
