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
                console.log("BEFORE COUNT", room.playersCount);

                this.players[socket.id].leaveRoom()
                console.log("COUNT", room.playersCount);
                if (room.playersCount === 0) {
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

                socket.emit('login', message)
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

                socket.join(socket.id) // подключение к комнате сокетов
                
                this.rooms[socket.id] = room
                console.log(this.rooms);

                socket.emit('join', { roomId: room.id })
                console.log("createRoom");
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
                socket.join(id) // подключение к комнате сокетов

                socket.emit('join', { roomId: this.players[socket.id].room.id })
                console.log("joinRoom");
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

