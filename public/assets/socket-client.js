const socket = io();

function changeStatus(status) {

    let statusCircle = document.getElementById('status');
    let statusText = document.getElementById('statusText');

    if(status == 'connect'){
        statusCircle.classList.remove('bg-red-500');
        statusCircle.classList.add('bg-green-500');
        statusText.innerHTML = 'Socket connected';
    }

    if(status == 'disconnect'){
        statusCircle.classList.remove('bg-green-500');
        statusCircle.classList.add('bg-red-500');
        statusText.innerHTML = 'Socket disconnected';
    }
}

function randomizeName() {
    let name = document.getElementById('user');
    name.value = 'User-' + Math.floor(Math.random() * 100);
    return name.value;
}

function addIncomingMessage(payload) {
    let message = `<div class="block w-1/2 p-2 rounded bg-orange-200">
                    <p class="text-xs font-medium text-slate-700 mb-2">${payload.user}</p>
                    <p class="text-sm">${payload.message}</p>
                </div>`;
    let container = document.getElementById('messages');
    container.insertAdjacentHTML('beforeend', message);
}

function addSentMessage(payload) {
    let message = `<div class="block p-2 rounded w-1/2 bg-green-200 self-end">
                    <p class="text-xs font-medium text-slate-700 mb-2">${payload.user}</p>
                    <p class="text-sm">${payload.message}</p>
                </div>`;
    let container = document.getElementById('messages');
    container.insertAdjacentHTML('beforeend',message);
}

function addUser(name){
    let container = document.getElementById('users');
    let item = `<div id="${name}" class="flex flex-row gap-2 p-2 mb-2">
                        <div class="rounded-full p-2 bg-green-500"></div>
                        <p class="text-xs font-medium text-slate-700">${name}</p>
                    </div>`;

    container.insertAdjacentHTML('beforeend', item);
}

function removeUser(name){
    let container = document.getElementById('users');
    let item = document.getElementById(name);
    container.removeChild(item);
}

//Socket actions

socket.on('connect', () => {    
    changeStatus('connect');
    let name = randomizeName();
    
    socket.emit('new-user', name, payload => {
        console.log('you connected');
        console.log(payload);
    });
});

socket.on('disconnect', () => {
    changeStatus('disconnect');
});

socket.on('changed-users', (payload) => {
    console.log('user connected ', payload);

    document.getElementById('users').innerHTML = '';
    for(let id in payload){
        addUser(payload[id]);
    }

});

socket.on('disconnected-user', (payload) => {
    console.log('user disconnected ', payload);
    //let name = payload;
    //removeUser(name);
});

socket.on('receive-message', (payload) => {
    let user = document.getElementById('user').value;
    console.log(payload);
    if(user == payload.friend){
        addIncomingMessage(payload);
    }
});

//Form action

const sendMessageForm = document.getElementById('sendMessageForm'); 
sendMessageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    let payload = {
        user: formData.get('user'),
        message: formData.get('message'),
        friend: formData.get('friend'),
    };

    socket.emit('send-message', payload);

    addSentMessage(payload);
});