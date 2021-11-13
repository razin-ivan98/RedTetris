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
        this.rooms = {
            1: new Room(1, "jhjkh")
        }
        this.players = {}
    }

    initRoutes() {
        this.io.on('connection', (socket) => {
            console.log('A user connected', socket.id);

            socket.on('disconnect', () => {
                console.log('A user disconnected')
                if (!this.players[socket.id]) { // если незарегистрирован
                    return
                }
                const room = this.players[socket.id].room
                if (!room) { //не состоит в комнате
                    return
                }
                // console.log("BEFORE COUNT", room.playersCount);

                this.players[socket.id].leaveRoom()

                socket.leave(`room-${room.id}`) // покидаем все комнаты
                socket.leave('lobby')

                // console.log("COUNT", room.playersCount);
                if (room.playersCount === 0) {
                    this.rooms[room.id].stop()
                    delete this.rooms[room.id]
                }

                delete this.players[socket.id]
            })

            socket.on('login', (message) => {
                console.log('login: ', message)

                if (this.players[socket.id]) { // если уже есть игрок
                    return
                }

                this.players[socket.id] = new Player(socket.id, message.username)

                socket.join('lobby') // присоединение к комнате лобби

                socket.emit('login', { username: message.username, id: socket.id })
            })

            socket.on('getRooms', () => {
                console.log("getRooms");
                socket.emit('getRooms', { rooms: Object.values(this.rooms) })
            })

            socket.on('createRoom', () => {
                if (!this.players[socket.id]) { // если незарегистрирован
                    return
                }
                if (this.rooms[socket.id]) {// если на его имя уже есть комната. Сделать ошибки на это все это уже проверено у юзера
                    return
                }
                const room = this.players[socket.id].createRoom()

                if (!room) { // не создалось
                    return
                }

                socket.join(`room-${socket.id}`) // подключение к комнате сокетов

                socket.leave('lobby') // отписка от комнаты лобби
                
                this.rooms[socket.id] = room
                // console.log(this.rooms);

                this.io.to('lobby').emit('getRooms', { rooms: Object.values(this.rooms) }) // обновляем комнаты всем кто в лобби (я уже не там)

                socket.emit('join', { roomId: room.id })

                // this.rooms[socket.id].start(() =>
                //     this.io.to(`room-${socket.id}`).emit('gamedata', { gamedata: this.rooms[socket.id].gamedata })
                // )

                // console.log("createRoom");
                // socket.emit('getRooms', {1: "room", 2: "room", 3: "room", 4: "room"})
            })

            socket.on('joinRoom', ({id}) => {
                if (!this.players[socket.id]) { // если незарегистрирован
                    return
                }
                if (!this.rooms[id]) { //нету такой комнаты
                    return
                }
                const res = this.players[socket.id].joinRoom(this.rooms[id])
                if (!res) {
                    return false
                }
                // this.rooms[id].join(socket.id, this.players[socket.id].username)
                socket.join(`room-${id}`) // подключение к комнате сокетов

                socket.leave('lobby') // отписка от комнаты лобби

                socket.emit('join', { roomId: id })
                this.io.to(`room-${id}`).emit('gamedata', { gamedata: this.rooms[id].gamedata })
                console.log("joinRoom");
                return true
                // socket.emit('getRooms', {1: "room", 2: "room", 3: "room", 4: "room"})
            })

            socket.on('startGame', () => {
                if (!this.players[socket.id]) { // если незарегистрирован
                    return
                }
                if (!this.rooms[socket.id]) { // у тебя нету комнаты
                    return
                }
                if (this.rooms[socket.id].isActive) { // уже запущена
                    return
                }

                this.rooms[socket.id].start(() =>
                    this.io.to(`room-${socket.id}`).emit('gamedata', { gamedata: this.rooms[socket.id].gamedata })
                )

                // socket.emit('startGame', { roomId: this.players[socket.id].room.id })
                // console.log("joinRoom");
                return true
                // socket.emit('getRooms', {1: "room", 2: "room", 3: "room", 4: "room"})
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
                
                // if (!this.rooms[socket.id].isActive) { // уже проиграл
                //     return
                // }
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
            
                    default:
                        break;
                }
                this.io.to(`room-${room.id}`).emit('gamedata', { gamedata: room.gamedata })
                // socket.emit('startGame', { roomId: this.players[socket.id].room.id })
                // console.log("joinRoom");
                return true
                // socket.emit('getRooms', {1: "room", 2: "room", 3: "room", 4: "room"})
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

