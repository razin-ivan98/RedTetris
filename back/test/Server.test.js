const assert = require('assert')
const Server = require('../src/Server')
const FakeSocket = require('./FakeSocket')
const FakeIO = require('./FakeIO')
const Player = require('../src/Player')
const Room = require('../src/Room')

describe('WebSocket Server test', () => {
    it('Should be created', () => {
        const server = new Server()

        assert(server.http)
        assert(server.io)
        assert(server._rooms)
        assert(server.players)
        assert(server.app)
    })

    it('Should return rooms', () => {
        const server = new Server()

        const rooms = server.rooms

        assert(rooms)
    })

    describe('WebSocket routes test', () => {
        describe('Login test', () => {
            it('Should reqister user, send message and join WS "lobby" room', () => {
                const server = new Server()
                const socket = new FakeSocket()
                const data = { username: "name" }

                server.onLogin(socket, data)

                assert(server.players[socket.id])
                assert(socket.rooms['lobby'])
                assert.deepEqual(socket.events[0], { event: 'login', message: { username: 'name', id: socket.id } })
            })

            it('Should not register user and send message', () => {
                const server = new Server()
                server.players['id'] = 'id'
                const socket = new FakeSocket('id')
                const data = { username: 'name' }

                server.onLogin(socket, data)

                assert.deepEqual(socket.events[0], void 0)
            })
        })

        it('Should send rooms', () => {
            const server = new Server()
            const socket = new FakeSocket()

            server.onGetRooms(socket)

            assert.deepEqual(socket.events[0], { event: 'getRooms', message: { rooms: server.rooms } })
        })

        describe('Create room test', () => {
            it('Should create room, join WS room, leave WS lobby, send rooms to lobby and send gamedata to room', () => {
                const server = new Server()
                const socket = new FakeSocket('id', { 'lobby': 'lobby' })
                const io = new FakeIO()
                server.io = io
                server.players['id'] = new Player('id', 'name')

                server.onCreateRoom(socket)

                assert(server._rooms['id'])
                assert.equal(socket.rooms['lobby'], void 0)
                assert(socket.rooms['room-id'])
                assert.deepEqual(io.rooms['lobby'].messages[0], { event: 'getRooms', message: { rooms: server.rooms }} )
                assert.deepEqual(io.rooms['room-id'].messages[0], { event: 'gamedata', message: { gamedata: server._rooms[socket.id].gamedata }} )
            })

            it('Should not do enything (user is not registered)', () => {
                const server = new Server()
                const socket = new FakeSocket('id', { 'lobby': 'lobby' })
                const io = new FakeIO()
                server.io = io

                const status = server.onCreateRoom(socket)

                assert.equal(status, false)
            })

            it('Should not do enything (room already exists)', () => {
                const server = new Server()
                const socket = new FakeSocket('id', { 'lobby': 'lobby' })
                const io = new FakeIO()
                server.io = io
                server.players['id'] = new Player('id', 'name')
                server._rooms['id'] = 'room'

                const status = server.onCreateRoom(socket)

                assert.equal(status, false)
            })

            it('Should not do enything (user in other room)', () => {
                const server = new Server()
                const socket = new FakeSocket('id', { 'lobby': 'lobby' })
                const io = new FakeIO()
                server.io = io
                server.players['id'] = new Player('id', 'name')
                server.players['id'].room = 'other room'

                const status = server.onCreateRoom(socket)

                assert.equal(status, false)
            })
        })

        describe('Join room test', () => {
            it('Should join room, join WS room, leave WS lobby, send rooms to lobby, send "join" to user and send gamedata to room', () => {
                const server = new Server()
                const socket = new FakeSocket('id', { 'lobby': 'lobby' })
                const io = new FakeIO()
                server.io = io
                server.players['id'] = new Player('id', 'name')
                server._rooms['otherId'] = new Room('otherId', 'otherName')

                server.onJoinRoom(socket, { id: 'otherId' })

                // assert(server._rooms['id'])
                assert.equal(socket.rooms['lobby'], void 0)
                assert(socket.rooms['room-otherId'])
                assert.deepEqual(io.rooms['lobby'].messages[0], { event: 'getRooms', message: { rooms: server.rooms }} )
                assert.deepEqual(io.rooms['room-otherId'].messages[0], { event: 'gamedata', message: { gamedata: server._rooms['otherId'].gamedata }} )
                assert.deepEqual(socket.events[0], { event: 'join', message: { roomId: 'otherId' }} )
            })

            it('Should not do enything (user is not registered)', () => {
                const server = new Server()
                const socket = new FakeSocket('id', { 'lobby': 'lobby' })
                const io = new FakeIO()
                server.io = io
                server._rooms['otherId'] = new Room('otherId', 'otherName')

                const status = server.onJoinRoom(socket, { id: 'otherId' })

                assert.equal(status, false)
            })

            it('Should not do enything (room not exists)', () => {
                const server = new Server()
                const socket = new FakeSocket('id', { 'lobby': 'lobby' })
                const io = new FakeIO()
                server.io = io
                server.players['id'] = new Player('id', 'name')

                const status = server.onJoinRoom(socket, { id: 'otherId' })

                assert.equal(status, false)
            })

            it('Should not do enything (user in other room)', () => {
                const server = new Server()
                const socket = new FakeSocket('id', { 'lobby': 'lobby' })
                const io = new FakeIO()
                server.io = io
                server._rooms['otherId'] = new Room('otherId', 'otherName')
                server.players['id'] = new Player('id', 'name')
                server.players['id'].room = 'other room'

                const status = server.onJoinRoom(socket, { id: 'otherId' })

                assert.equal(status, false)
            })
        })

        describe('Stop and delete room if empty test', () => {
            it('Should stop and delete room (it is empty)', () => {
                const server = new Server()
                const endCb = () => void 0
                server._rooms['otherId'] = new Room('otherId', 'otherName')
                server._rooms['otherId'].players = {}
                server._rooms['otherId'].playersCount = 0
                server._rooms['otherId'].endCb = endCb
                server._rooms['otherId'].isActive = true 

                server.deleteIfEmpty(server._rooms['otherId'])

                assert.equal(server._rooms['otherId'], void 0)
            })

            it('Should not do anything (is not empty)', () => {
                const server = new Server()
                const endCb = () => void 0
                server._rooms['otherId'] = new Room('otherId', 'otherName')
                server._rooms['otherId'].endCb = endCb
                server._rooms['otherId'].isActive = true 

                const status = server.deleteIfEmpty(server._rooms['otherId'])

                assert.equal(status, false)
            })
        })

        describe('Disconnecting test', () => {
            it('Should leave room, leave all WS rooms, delete player send rooms to lobby, gamedata to room', () => {
                const server = new Server()
                const socket = new FakeSocket('id', { 'room-id': 'room-id' })
                const io = new FakeIO()
                server.io = io
                server.players['id'] = new Player('id', 'name')
                server._rooms['id'] = new Room('id', 'name')
                server._rooms['id'].players['otherId'] = new Player('otherId', 'name')
                server._rooms['id'].playersCount++
                server.players['id'].room = server._rooms['id']

                server.onDisconnect(socket)

                assert.equal(server._rooms['id'].players['id'], void 0)
            })

            it('Should not do enything (user is not registered)', () => {
                const server = new Server()
                const socket = new FakeSocket('id', { 'room-id': 'room-id' })
                const io = new FakeIO()
                server.io = io

                const status = server.onDisconnect(socket)

                assert.equal(status, false)
            })

            it('Should delete user', () => {
                const server = new Server()
                const socket = new FakeSocket('id', { 'room-id': 'room-id' })
                const io = new FakeIO()
                server.io = io
                server.players['id'] = new Player('id', 'name')
                server._rooms['id'] = new Room('otherId', 'name')

                server.onDisconnect(socket)

                assert.equal(server.players['id'], void 0)
            })
        })

        describe('Leave room test', () => {
            it('Should leave room, leave WS room, join WS lobby, send rooms to lobby, gamedata to room', () => {
                const server = new Server()
                const socket = new FakeSocket('id', { 'room-id': 'room-id' })
                const io = new FakeIO()
                server.io = io
                server.players['id'] = new Player('id', 'name')
                server._rooms['id'] = new Room('id', 'name')
                server._rooms['id'].players['otherId'] = new Player('otherId', 'name')
                server._rooms['id'].playersCount++
                server.players['id'].room = server._rooms['id']

                server.onLeaveRoom(socket)

                assert.equal(server._rooms['id'].players['id'], void 0)
            })

            it('Should not do enything (user is not registered)', () => {
                const server = new Server()
                const socket = new FakeSocket('id', { 'room-id': 'room-id' })
                const io = new FakeIO()
                server.io = io

                const status = server.onLeaveRoom(socket)

                assert.equal(status, false)
            })

            it('Should not do enything (user is not in room)', () => {
                const server = new Server()
                const socket = new FakeSocket('id', { 'room-id': 'room-id' })
                const io = new FakeIO()
                server.io = io
                server.players['id'] = new Player('id', 'name')

                const status = server.onLeaveRoom(socket)

                assert.equal(status, false)
            })

        })

        describe('Start game test', () => {
            it('Should start game and send rooms to lobby', () => {
                const server = new Server()
                const socket = new FakeSocket('id', { 'room-id': 'room-id' })
                const io = new FakeIO()
                server.io = io
                server.players['id'] = new Player('id', 'name')
                server._rooms['id'] = new Room('id', 'name')
                
                server.onStartGame(socket, { infMode: false, withPenalty: false })

                assert.equal(server._rooms['id'].isActive, true)
                assert.deepEqual(io.rooms['lobby'].messages[0], { event: 'getRooms', message: { rooms: server.rooms }} )
            })

            it('Should not start game (not registered)', () => {
                const server = new Server()
                const socket = new FakeSocket('id', { 'room-id': 'room-id' })
                const io = new FakeIO()
                server.io = io
                
                const status = server.onStartGame(socket, { infMode: false, withPenalty: false })

                assert.equal(status, false)
            })

            it('Should not start game (user have no room)', () => {
                const server = new Server()
                const socket = new FakeSocket('id', { 'room-id': 'room-id' })
                const io = new FakeIO()
                server.io = io
                server.players['id'] = new Player('id', 'name')
                
                const status = server.onStartGame(socket, { infMode: false, withPenalty: false })

                assert.equal(status, false)
            })

            it('Should not start game (room already is active)', () => {
                const server = new Server()
                const socket = new FakeSocket('id', { 'room-id': 'room-id' })
                const io = new FakeIO()
                server.io = io
                server.players['id'] = new Player('id', 'name')
                server._rooms['id'] = new Room('id', 'name')
                server._rooms['id'].isActive = true
                
                const status = server.onStartGame(socket, { infMode: false, withPenalty: false })

                assert.equal(status, false)
            })
        })

        describe('Game action test', () => {
            it('Should not do anything (not registered)', () => {
                const server = new Server()
                const socket = new FakeSocket('id', { 'room-id': 'room-id' })
                const io = new FakeIO()
                server.io = io
                
                const status = server.onGameAction(socket, { type: 'right' })

                assert.equal(status, false)
            })

            it('Should not do anything (user not in room)', () => {
                const server = new Server()
                const socket = new FakeSocket('id', { 'room-id': 'room-id' })
                const io = new FakeIO()
                server.io = io
                server.players['id'] = new Player('id', 'name')
                
                const status = server.onGameAction(socket, { type: 'right' })

                assert.equal(status, false)
            })

            it('Should not do anything (room is not active)', () => {
                const server = new Server()
                const socket = new FakeSocket('id', { 'room-id': 'room-id' })
                const io = new FakeIO()
                server.io = io
                server.players['id'] = new Player('id', 'name')
                server._rooms['id'] = new Room('id', 'name')
                server.players['id'].room = server._rooms['id']
                
                const status = server.onGameAction(socket, { type: 'right' })

                assert.equal(status, false)
            })

            it('Should do right action', () => {
                const server = new Server()
                const socket = new FakeSocket('id', { 'room-id': 'room-id' })
                const io = new FakeIO()
                server.io = io
                server.players['id'] = new Player('id', 'name')
                server._rooms['id'] = new Room('id', 'name')
                server.players['id'].room = server._rooms['id']
                server._rooms['id'].isActive = true
                
                const status = server.onGameAction(socket, { type: 'right' })

                assert.equal(status, true)
            })

            it('Should do left action', () => {
                const server = new Server()
                const socket = new FakeSocket('id', { 'room-id': 'room-id' })
                const io = new FakeIO()
                server.io = io
                server.players['id'] = new Player('id', 'name')
                server._rooms['id'] = new Room('id', 'name')
                server.players['id'].room = server._rooms['id']
                server._rooms['id'].isActive = true
                
                const status = server.onGameAction(socket, { type: 'left' })

                assert.equal(status, true)
            })

            it('Should do rotate action', () => {
                const server = new Server()
                const socket = new FakeSocket('id', { 'room-id': 'room-id' })
                const io = new FakeIO()
                server.io = io
                server.players['id'] = new Player('id', 'name')
                server._rooms['id'] = new Room('id', 'name')
                server.players['id'].room = server._rooms['id']
                server._rooms['id'].isActive = true
                
                const status = server.onGameAction(socket, { type: 'rotate' })

                assert.equal(status, true)
            })

            it('Should do drop action', () => {
                const server = new Server()
                const socket = new FakeSocket('id', { 'room-id': 'room-id' })
                const io = new FakeIO()
                server.io = io
                server.players['id'] = new Player('id', 'name')
                server._rooms['id'] = new Room('id', 'name')
                server.players['id'].room = server._rooms['id']
                server._rooms['id'].isActive = true
                
                const status = server.onGameAction(socket, { type: 'drop' })

                assert.equal(status, true)
            })

            it('Should do other action', () => {
                const server = new Server()
                const socket = new FakeSocket('id', { 'room-id': 'room-id' })
                const io = new FakeIO()
                server.io = io
                server.players['id'] = new Player('id', 'name')
                server._rooms['id'] = new Room('id', 'name')
                server.players['id'].room = server._rooms['id']
                server._rooms['id'].isActive = true
                
                const status = server.onGameAction(socket, { type: 'other' })

                assert.equal(status, true)
            })

        })
    })

    describe('WS Routes test', () => {
        it('initRoutes test', () => {
            const server = new Server()
            const socket = new FakeSocket('id', { 'room-id': 'room-id' })
            const io = new FakeIO(socket)
            server.io = io

            server.initRoutes()

            socket.listeners['login']({ username: 'name' })
            socket.listeners['getRooms']()
            socket.listeners['createRoom']()
            socket.listeners['joinRoom']({ id: 'id' })
            socket.listeners['disconnect']()
            socket.listeners['leaveRoom']()
            socket.listeners['startGame']({ infMode: false, withPenalty: false })
            socket.listeners['gameAction']({ type: 'right' })
        })
    })
})
