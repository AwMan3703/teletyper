
// VARIABLES

// @ts-ignore
const URLParameters = new URLSearchParams(window.location.search)

// @ts-ignore
const url_username = URLParameters.get('username')

const room_name_input = document.getElementById('name')
const room_maxParticipants_input = document.getElementById('max-participants')
const room_inviteOnly_checkbox = document.getElementById('invite-only')
// @ts-ignore
const room_password_input = document.getElementById('password')
// @ts-ignore
const username_input = document.getElementById('username')
// @ts-ignore
const back_button = document.getElementById('back-button');
const create_button = document.getElementById('create-button');


// FUNCTIONS

async function room_name_validator(value: string) {
    // Easy conditions to avoid making too many requests
    if (value.length < 1 || value.length > 20) { return false }

    // GET the endpoint
    const response = await fetch(`/check/room-name/${value}`)

    // Return true if the status is in the 200 range
    return response.ok
}

// @ts-ignore
async function username_input_validator(value: string) {
    // Easy conditions to avoid making too many requests
    if (value.length < 1 || value.length > 20) { return false }

    // GET the endpoint
    const response = await fetch(`/check/username/${value}`)

    // Return true if the status is in the 200 range
    return response.ok
}

function createChat(room_name: string, max_participants: number, username: string, room_password?: string) {
    if (room_name.length < 1 || room_name.length > 20) { console.error('Cannot create chat: Room name is missing or invalid'); return }
    if (!max_participants || !parseInt(max_participants.toString())) { console.error('Cannot create chat: Max participants is missing or cannot be converted to integer'); return }
    max_participants = parseInt(max_participants.toString())
    if (!username) { console.error('Cannot create chat: Username is missing'); return }
    if (max_participants < 1 || max_participants > 10) { console.error('Cannot create chat: Max participants is outside the 1-10 range'); return }

    const params = new URLSearchParams()
    params.set('maxparticipants', max_participants.toString())
    params.set('username', username)
    if (room_password) params.set('password', room_password)

    // REQUEST ROOM CREATION //
    fetch(`/rooms/create/${room_name}?${params.toString()}`)
        .then(async response => {
            if ([200, 201].includes(response.status)) { // May return 200 or 201
                // Return
                return response.json()
            } else if ([406, 409].includes(response.status)) { // The room or username are not acceptable
                const body = await response.json()
                if (body.fault === 'room-name') {
                    // @ts-ignore
                    setValidityClass(room_name_input, false)
                } else if (body.fault === 'username') {
                    // @ts-ignore
                    setValidityClass(username_input, false)
                }
                throw new Error("Could not create new room!")
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
            params.set('room-id', data.room_id)
            if (room_password) params.set('room-password', room_password)
            params.set('username', username)

            // Redirect to chat page
            window.location.href = `chat.html?${params.toString()}`
        })
}


// SCRIPT

// @ts-ignore
validateInput(room_name_input, ['focusout'], room_name_validator)
// @ts-ignore
validateInput(username_input, ['focusout'], username_input_validator)

// @ts-ignore
room_inviteOnly_checkbox.addEventListener('click', _ => { room_password_input.toggleAttribute('disabled') })

// @ts-ignore
back_button.onclick = function () {
    window.history.back()
}

// @ts-ignore
create_button.onclick = function () {
    // @ts-ignore
    const room_name = room_name_input?.value
    // @ts-ignore
    const room_maxParticipants = room_maxParticipants_input?.value || 5
    // @ts-ignore
    const room_password = room_password_input?.value
    // @ts-ignore
    const username = username_input?.value || url_username

    if (!room_name) { alert('Room name is missing! Please fill all required inputs'); return }
    if (!parseInt(room_maxParticipants)) { alert('Max participants cannot be parsed to an integer! Please input correctly formatted values'); return }
    const room_n_maxParticipants = parseInt(room_maxParticipants)
    if (room_n_maxParticipants < 1 || room_n_maxParticipants > 10) { alert('Max participants is outside the 1-10 range! Please input accepted values'); return }
    if (!username) { alert('Username is missing! Please fill all required inputs'); return }

    createChat(room_name, room_n_maxParticipants, username, room_password)
}

// For now
// @ts-ignore
setValidityClass(room_name_input, false)
// @ts-ignore
setValidityClass(username_input, false)