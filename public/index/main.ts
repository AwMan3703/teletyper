
const liveChatsList = document.getElementById("live-chats-list");
const liveChatElementTemplate = document.getElementById("live-chats-list-item-template");



fetch('/live-rooms')
    .then(response => {
        // Check if the response is OK (status code in the range 200-299)
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Parse JSON data
    })
    .then(data => {
        console.log('Avaliable rooms:')
        data.forEach((room: { name: string; }) => {
            console.log('- '+room.name);
        })
    })
    .catch(error => {
        console.error('Error fetching live chats:', error);
    });