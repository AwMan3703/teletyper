
// VARIABLES

let IS_PASSWORD_REQUIRED = false
let IS_USERNAME_AVAILABLE = true

const TAKEN_USERNAMES: string[] = []

// @ts-ignore
const URLParameters = new URLSearchParams(window.location.search)

const url_roomID = URLParameters.get('room-id')
const url_roomPassword = URLParameters.get('room-password')
const url_username = URLParameters.get('username')

const room_id_input = document.getElementById('room-ID')
const room_password_input = document.getElementById('room-password')
const username_input = document.getElementById('username')
const join_button = document.getElementById('join-button');


// FUNCTIONS

async function room_id_input_validator(value: string) {
    // Easy conditions to avoid making too many requests
    if (value.length !== 6) { return false }

    // GET the endpoint
    const response = await fetchRoomData(value)

    // If the response code is 401, we know the password is required
    if (response.status === 401) { IS_PASSWORD_REQUIRED = true }

    // Return true if the status is in the 200 range
    return 199 < response.status && response.status < 300
}

async function room_password_validator(value: string) {
    // Easy conditions to avoid making too many requests
    if (!IS_PASSWORD_REQUIRED && value === '') { return true }
    else if (!IS_PASSWORD_REQUIRED && value !== '') { return false }
    else if (IS_PASSWORD_REQUIRED && value === '') { return false }

    // GET the endpoint
    const response = await fetchRoomData(value)

    // If the response code is 401, we know the password is required
    if (response.status === 401) { IS_PASSWORD_REQUIRED = true }

    // Return true if the status is in the 200 range
    return 199 < response.status && response.status < 300
}

async function username_validator(value: string) {
    // Easy conditions to avoid making too many requests
    if (value.length < 1 || value.length > 20) { return false }

    // GET the endpoint
    const response = await fetch(`/check-username/${value}`)

    // Return true if the status is in the 200 range
    return 199 < response.status && response.status < 300
}

function joinChat(room_id: string, room_password: string | null, username: string) {
    if (!room_id || room_id.length !== 6) { console.error('Cannot redirect to chat: Room ID is missing or invalid'); return }
    if (!username) { console.error('Cannot redirect to chat: Username is missing'); return }

    // REQUEST USER REGISTRATION //
    fetch(`/rooms/join/${room_id}`, {
        method: 'POST',
        body: JSON.stringify({
            password: room_password,
            username: username }),
        headers: { "Content-Type" : "application/json" }
    })

        .then(response => {
            if ([200, 202].includes(response.status)) { // May return 200 or 202
                // Return
                return response.json()
            } else if (response.status === 404) { // The room code is wrong
                // @ts-ignore
                setValidityClass(room_password_input)
            } else if ([406, 409].includes(response.status)) { // Someone stole the username before we connected
                // @ts-ignore
                setValidityClass(username_input, false)
            } else if (response.status === 401) { // The password is wrong I guess?
                // @ts-ignore
                setValidityClass(room_password_input, false)
            } else if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
        })
        .then(data => {
            // Get the session token
            const token = data.session_token
            console.log(`Obtained session token (${token})`)

            // Save the session token
            localStorage.setItem('session-token', token)
            // Create url parameters
            const params = new URLSearchParams()
            params.set('room-id', room_id)

            // Redirect to chat page
            window.location.href = `chat.html?${params.toString()}`
        })
    // ######################### //

    /* REQUEST USER REGISTRATION //
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `/rooms/join/${room_id}`)
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')

    xhr.onreadystatechange = function () {
        if (this.readyState !== XMLHttpRequest.DONE) { return }
        if ([200, 202].includes(this.status)) { // May return 200 or 202

            // Parse the response
            const data = JSON.parse(this.responseText)
            // Get the session token
            const token = data.session_token
            console.log(`Obtained session token (${token})`)

            // Save the session token
            localStorage.setItem('session-token', token)
            // Create url parameters
            const params = new URLSearchParams()
            params.set('room-id', room_id)
            // Redirect to chat page
            window.location.href = `chat.html?${params.toString()}`

        } else if (this.status === 404) { // The room code is wrong
            // @ts-ignore
            setValidityClass(room_password_input)
        } else if ([406, 409].includes(this.status)) { // Someone stole the username before we connected
            // @ts-ignore
            setValidityClass(username_input, false)
        } else if (this.status === 401) { // The password is wrong I guess?
            // @ts-ignore
            setValidityClass(room_password_input, false)
        } else if (!this.response.ok) { throw new Error(`HTTP error! status: ${this.response}`); }
    }

    const body = new URLSearchParams()
    body.set('password', room_password || '')
    body.set('username', username)

    xhr.send(body)
    // ######################### */
}


// SCRIPT

if (url_roomID && url_roomPassword && url_username)
{ joinChat(url_roomID, url_roomPassword, url_username) }
else {
    // @ts-ignore
    room_id_input.value = url_roomID ? url_roomID : ''
    // @ts-ignore
    if (url_roomID) room_id_input_validator(url_roomID).then(is_valid => { setValidityClass(room_id_input, is_valid) })
    // @ts-ignore
    room_password_input.value = url_roomPassword ? url_roomPassword : ''
    // @ts-ignore
    username_input.value = url_username ? url_username : ''
}

// @ts-ignore
validateInput(room_id_input, ['focusout'], room_id_input_validator)
// @ts-ignore
validateInput(room_password_input, ['focusout'], room_password_validator)
// @ts-ignore
validateInput(username_input, ['focusout'], username_validator)

// @ts-ignore
join_button.onclick = function () {
    // @ts-ignore
    const room_id = room_id_input?.value || url_roomID
    // @ts-ignore
    const room_password = room_password_input?.value || url_roomPassword
    // @ts-ignore
    const username = username_input?.value || url_username

    if (!room_id) { alert('Room ID is missing! Please fill all required inputs'); return }
    if (IS_PASSWORD_REQUIRED && (!room_password || room_password === ''))
    { alert('Please enter a valid password'); return }
    if (!username) { alert('Username is missing! Please fill all required inputs'); return }

    joinChat(room_id, room_password, username)
}
