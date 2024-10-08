
function setValidityClass(element: HTMLElement, is_valid: boolean) {
    const c = element.classList
    if (is_valid) { c.add('valid'); c.remove('invalid') }
    else { c.add('invalid'); c.remove('valid') }
}

function validateInput(input: HTMLInputElement, events: string[], validator: (value: string) => boolean) {
    events.forEach(event => {
        input.addEventListener(event, async _ => { setValidityClass(input, await validator(input.value)) })
    })
}

// @ts-ignore
async function fetchRoomData(room_id: string, room_password: string | null) {
    if (room_id.length !== 6) { throw new Error('Room ID is invalid') }

    const params = new URLSearchParams()
    if (room_password) params.set('password', room_password)

    const response = await fetch(`rooms/data/${room_id}?${params.toString()}`)
    if (!response) { throw new Error(`No response`)}
    if (!response.ok) { console.error(`HTTP error! status: ${response.status}`) }

    return response
}