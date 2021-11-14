const Express = require('express')
const Http = require('http')
const IO = require('socket.io')

const Room = require('./Room')
const Player = require('./Player')

// это для индекса
// app.get('/', function(req, res) {

// });

// вынести порт в конфиг


const CONFIG = {
    cors: {
        origin: '*',
    },
}

class Server {
    constructor () {
        this.app = Express()
        this.http = Http.Server(this.app)
        this.io = IO(this.http, CONFIG)
        this._rooms = {}
        this.players = {}
    }

    get rooms() {
        return Object.values(this._rooms).map(room => room.object)
    }

    initRoutes() {
        this.io.on('connection', (socket) => {
            socket.on('disconnect', () => {
                if (!this.players[socket.id]) { // если незарегистрирован
                    return
                }
                const room = this.players[socket.id].room
                if (!room) { //не состоит в комнате
                    return
                }

                this.players[socket.id].leaveRoom()

                socket.leave(`room-${room.id}`) // покидаем все комнаты

                // socket.emit('getRooms', { rooms: this.rooms })

                socket.leave('lobby')

                this.io.to('lobby').emit('getRooms', { rooms: this.rooms })
                this.io.to(`room-${room.id}`).emit('gamedata', { gamedata: this._rooms[room.id].gamedata })

                if (room.playersCount === 0) {
                    this._rooms[room.id].stop()
                    delete this._rooms[room.id]
                }

                delete this.players[socket.id]
            })

            socket.on('login', ({ username }) => {
                if (this.players[socket.id]) { // если уже есть игрок
                    return
                }

                this.players[socket.id] = new Player(socket.id, username)

                socket.join('lobby') // присоединение к комнате лобби

                socket.emit('login', { username: username, id: socket.id })
            })

            socket.on('getRooms', () => {
                console.log("getRooms", this.rooms );
                socket.emit('getRooms', { rooms: this.rooms })
                console.log("getRoomsOK");
            })

            socket.on('createRoom', () => {
                if (!this.players[socket.id]) { // если незарегистрирован
                    return
                }
                if (this._rooms[socket.id]) {// если на его имя уже есть комната. Сделать ошибки на это все это уже проверено у юзера
                    return
                }
                const room = this.players[socket.id].createRoom()

                if (!room) { // не создалось
                    return
                }

                socket.join(`room-${socket.id}`) // подключение к комнате сокетов

                socket.leave('lobby') // отписка от комнаты лобби
                
                this._rooms[socket.id] = room

                this.io.to('lobby').emit('getRooms', { rooms: this.rooms }) // обновляем комнаты всем кто в лобби (я уже не там)
                this.io.to(`room-${socket.id}`).emit('gamedata', { gamedata: this._rooms[socket.id].gamedata })

                socket.emit('join', { roomId: room.id })
            })

            socket.on('joinRoom', ({id}) => {
                if (!this.players[socket.id]) { // если незарегистрирован
                    return
                }
                if (!this._rooms[id]) { //нету такой комнаты
                    return
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
            })

            socket.on('leaveRoom', () => {
                if (!this.players[socket.id]) { // если незарегистрирован
                    return
                }
                if (!this.players[socket.id].room) { //не состоит в комнате
                    return
                }
                const room = this.players[socket.id].room

                socket.leave(`room-${room.id}`) // отключение от комнаты

                socket.join('lobby') // подписка на лобби

                this.players[socket.id].leaveRoom()
                
                socket.emit('join', { roomId: null })

                if (room.playersCount === 0) {
                    this._rooms[room.id].stop()
                    delete this._rooms[room.id]
                }
                
                this.io.to('lobby').emit('getRooms', { rooms: this.rooms }) // обновляем комнаты для лобби
                if (this._rooms[room.id]) {
                    this.io.to(`room-${room.id}`).emit('gamedata', { gamedata: this._rooms[room.id].gamedata })
                }

                return true
            })

            socket.on('startGame', ({infMode}) => {
                if (!this.players[socket.id]) { // если незарегистрирован
                    return
                }
                if (!this._rooms[socket.id]) { // у тебя нету комнаты
                    return
                }
                if (this._rooms[socket.id].isActive) { // уже запущена
                    return
                }

                this._rooms[socket.id].clearGame()

                this._rooms[socket.id].start(
                    infMode,
                    () => this.io.to(`room-${socket.id}`).emit('gamedata', { gamedata: this._rooms[socket.id].gamedata }),
                    () => this.io.to('lobby').emit('getRooms', { rooms: this.rooms }) // обновляем комнаты для лобби
                )

                this.io.to('lobby').emit('getRooms', { rooms: this.rooms }) // обновляем комнаты для лобби

                return true
            })

            socket.on('gameAction', ({type}) => {
                if (!this.players[socket.id]) { // если незарегистрирован
                    return
                }
                if (!this.players[socket.id].room) { // ты не в комнате
                    return
                }
                if (!this.players[socket.id].room.isActive) { // не запущена
                    return
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
                    case 'speed':
                        room.speed(socket.id)
                        break;
                    case 'drop':
                        room.drop(socket.id)
                        break;
            
                    default:
                        break;
                }
                this.io.to(`room-${room.id}`).emit('gamedata', { gamedata: room.gamedata })

                return true
            })
        })
    }

    listen() {
        this.http.listen(9000, () => {
            console.log('listening on *:9000')
        })
    }
}

const wsServer = new Server()

wsServer.initRoutes()
wsServer.listen()
