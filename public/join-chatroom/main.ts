
const room_id_input = document.getElementById('room-ID')
const room_password_input = document.getElementById('room-password')
const join_button = document.getElementById('join-button');


// @ts-ignore
join_button.onclick = function () {
    console.log('pressed')
    const params = new URLSearchParams();
    // @ts-ignore
    params.set('room-id', room_id_input.value);
    // @ts-ignore
    params.set('room-password', room_password_input.value);
    window.location.href = `chat.html?${params.toString()}`
}