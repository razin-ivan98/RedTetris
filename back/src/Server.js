const Express = require('express')
const Http = require('http')
const IO = require('socket.io')
const favicon = require('serve-favicon')

const Player = require('./Player')

const CONFIG = {
    cors: {
        origin: '*',
    },
}

class Server {
    constructor () {
        this.app = Express()
        this.app.get('/', function(req, res) {
            res.sendFile(__dirname + '/front_build/index.html');
        })
        this.app.use(Express.static('front_build'))
        this.app.use(favicon(__dirname + '/front_build/favicon.ico'))

        this.http = Http.Server(this.app)
        this.io = IO(this.http, CONFIG)
        this._rooms = {}
        this.players = {}
    }

    get rooms() {
        return Object.values(this._rooms).map(room => room.object)
    }

    onLogin(socket, { username }) {
        if (this.players[socket.id]) { // если уже есть игрок
            return
        }

        this.players[socket.id] = new Player(socket.id, username)

        socket.join('lobby') // присоединение к комнате лобби

        socket.emit('login', { username: username, id: socket.id })
    }

    onGetRooms(socket) {
        socket.emit('getRooms', { rooms: this.rooms })
    }

    onCreateRoom(socket) {
        if (!this.players[socket.id]) { // если незарегистрирован
            return false
        }
        if (this._rooms[socket.id]) {// если на его имя уже есть комната. Сделать ошибки на это все это уже проверено у юзера
            return false
        }
        const room = this.players[socket.id].createRoom()

        if (!room) { // не создалось
            return false
        }

        socket.join(`room-${socket.id}`) // подключение к комнате сокетов

        socket.leave('lobby') // отписка от комнаты лобби
        
        this._rooms[socket.id] = room

        this.io.to('lobby').emit('getRooms', { rooms: this.rooms }) // обновляем комнаты всем кто в лобби (я уже не там)
        this.io.to(`room-${socket.id}`).emit('gamedata', { gamedata: this._rooms[socket.id].gamedata })

        socket.emit('join', { roomId: room.id })
        return true
    }

    onJoinRoom(socket, { id }) {
        if (!this.players[socket.id]) { // если незарегистрирован
            return false
        }
        if (!this._rooms[id]) { //нету такой комнаты
            return false
        }
        const res = this.players[socket.id].joinRoom(this._rooms[id])
        if (!res) {
            return false
        }
        socket.join(`room-${id}`) // подключение к комнате сокетов

        socket.leave('lobby') // отписка от комнаты лобби

        this.io.to('lobby').emit('getRooms', { rooms: this.rooms }) // обновляем комнаты для лобби

        socket.emit('join', { roomId: id })
        this.io.to(`room-${id}`).emit('gamedata', { gamedata: this._rooms[id].gamedata })

        return true
    }

    deleteIfEmpty(room) {
        if (room.playersCount === 0) {
            this._rooms[room.id].stop()
            delete this._rooms[room.id]
            return true
        }
        return false
    }

    onDisconnect(socket) {
        if (!this.players[socket.id]) { // если незарегистрирован
            return false
        }
        const room = this.players[socket.id].room

        if (room) {
            this.players[socket.id].leaveRoom()

            socket.leave(`room-${room.id}`) // покидаем все комнаты

            socket.leave('lobby')

            this.io.to('lobby').emit('getRooms', { rooms: this.rooms })
            this.io.to(`room-${room.id}`).emit('gamedata', { gamedata: this._rooms[room.id].gamedata })

            this.deleteIfEmpty(room)
        }
        

        delete this.players[socket.id]

        return true
    }

    onLeaveRoom(socket) {
        if (!this.players[socket.id]) { // если незарегистрирован
            return false
        }
        const room = this.players[socket.id].room
        if (!room) { //не состоит в комнате
            return false
        }

        socket.leave(`room-${room.id}`) // отключение от комнаты

        socket.join('lobby') // подписка на лобби

        this.players[socket.id].leaveRoom()
        
        socket.emit('join', { roomId: null })

        this.io.to(`room-${room.id}`).emit('gamedata', { gamedata: this._rooms[room.id].gamedata })
        this.deleteIfEmpty(room)

        this.io.to('lobby').emit('getRooms', { rooms: this.rooms }) // обновляем комнаты для лобби

        return true
    }

    onStartGame(socket, { infMode, withPenalty }) {
        if (!this.players[socket.id]) { // если незарегистрирован
            return false
        }
        if (!this._rooms[socket.id]) { // у тебя нету комнаты
            return false
        }
        if (this._rooms[socket.id].isActive) { // уже запущена
            return false
        }

        this._rooms[socket.id].clearGame()

        this._rooms[socket.id].start(
            infMode,
            withPenalty,
            () => this.io.to(`room-${socket.id}`).emit('gamedata', { gamedata: this._rooms[socket.id].gamedata }),
            () => this.io.to('lobby').emit('getRooms', { rooms: this.rooms }) // обновляем комнаты для лобби
        )

        this.io.to('lobby').emit('getRooms', { rooms: this.rooms }) // обновляем комнаты для лобби

        return true
    }

    onGameAction(socket, { type }) {
        if (!this.players[socket.id]) { // если незарегистрирован
            return false
        }
        if (!this.players[socket.id].room) { // ты не в комнате
            return false
        }
        if (!this.players[socket.id].room.isActive) { // не запущена
            return false
        }

        const room = this.players[socket.id].room

        switch (type) {
            case 'right':
                room.right(socket.id)
                break;
            case 'left':
                room.left(socket.id)
                break;
            case 'rotate':
                room.rotate(socket.id)
                break;
            case 'drop':
                room.drop(socket.id)
                break;
            case 'forward':
                room.forward(socket.id)
                break;
            default:
                break;
        }
        this.io.to(`room-${room.id}`).emit('gamedata', { gamedata: room.gamedata })

        return true
    }

    initRoutes() {
        this.io.on('connection', (socket) => {
            socket.on('disconnect', () => {
                this.onDisconnect(socket)
            })

            socket.on('login', data => {
                this.onLogin(socket, data)
            })

            socket.on('getRooms', () => {
                this.onGetRooms(socket)
            })

            socket.on('createRoom', () => {
                this.onCreateRoom(socket)
            })

            socket.on('joinRoom', data => {
                this.onJoinRoom(socket, data)
            })

            socket.on('leaveRoom', () => {
                this.onLeaveRoom(socket)
            })

            socket.on('startGame', data => {
                this.onStartGame(socket, data)
            })

            socket.on('gameAction', (data) => {
                this.onGameAction(socket, data)
            })
        })
        return true
    }

    listen() {
        this.http.listen(9000, () => {
            console.log('listening on *:9000')
        })
    }
}

module.exports = Server
