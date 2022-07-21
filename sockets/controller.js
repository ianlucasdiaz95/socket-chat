
var users = {};

const socketController = (socket) => {
    console.log('Cliente conectado: ', socket.id);
    const id = socket.id;

    socket.on('disconnect', () => {
        console.log('Cliente desconectado : ', socket.id);

        delete users[id];
        socket.emit('changed-users', users);
        socket.broadcast.emit('changed-users', users);
    });

    socket.on('new-user', (payload, callback) => {

        console.log('new-user: ', payload);
        users[id] = payload;
        
        socket.emit('changed-users', users);
        socket.broadcast.emit('changed-users', users);

        callback(users);
    });

    socket.on('send-message', (payload) => {
        console.log('Mensaje recibido:', payload);

        socket.broadcast.emit('receive-message', payload);
    });
}

module.exports = socketController;