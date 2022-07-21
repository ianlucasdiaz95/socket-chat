const express = require('express');
const cors = require('cors');
const socketController = require('../sockets/controller');

require('dotenv').config();

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);

        this.paths = {
            auth: '/api/auth',
            users: '/api/users',
        }

        this.middlewares();

        this.sockets();

        //this.routes();

    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());

        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.users, require('../routes/users'));
    }

    sockets() {

        this.io.on('connection', socketController);

    }

    listen() {
        this.server.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }

}


module.exports = Server;