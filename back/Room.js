const Game = require('./Game')

const PLAYERS_LIMIT = 3

class Room {
    constructor (id, ownername) {
        this.id = id
        this.players = {
            [id]: {
                id,
                username: ownername,
                score: 0,
                game: new Game(),
                losed: false,
                wined: false
            }
        },
        this.playersCount = 1
        this.isActive = false
        this.interval = null
        this.tickCb = null
        this.endCb = null
        this.infMode = false
    }

    start(infMode, tickCb, endCb) {
        if (this.isActive) {
            return
        }
        this.infMode = infMode
        this.isActive = true
        for (let player of Object.values(this.players)) {
            if (player.game)
                player.game.start()
        }
        this.tickCb = tickCb
        this.endCb = endCb

        this.interval = setInterval(() => this.tick(), 300) //в константу
    }

    stop() {
        this.isActive = false
        this.endCb()
        clearInterval(this.interval)
    }

    clearGame(){
        this.isActive = false
        this.infMode = false
        for (let player of Object.values(this.players)) {
            player.score = 0,
            player.game = new Game(),
            player.losed = false,
            player.wined = false
        }
    }

    tick() {
        if (!this.isActive) {
            return
        }
        if (Object.values(this.players).reduce((prev, curr) => prev && !curr.game.isActive, true)) {
            this.stop()
        }

        for (let player of Object.values(this.players)) {
            if (player.game) {
                player.game.tick()
            }
            if (!player.game.isActive) {
                player.losed = true
            }
        }

        if (!this.infMode && Object.values(this.players).filter(player => player.game.isActive).length === 1) {
            const winner = Object.values(this.players).find(player => player.game.isActive)
            winner.wined = true
            winner.game.isActive = false
            this.stop()
        }

        this.tickCb()
    }

    join(id, username) {
        if (this.isFull) { //
            return false
        }
        if (this.isActive) {
            return false
        }
        this.players[id] = {
            id,
            username: username,
            score: 0,
            game: new Game()
        }
        this.playersCount++

        return true
    }

    left(playerId) {
        this.players[playerId].game.left()
    }
    right(playerId) {
        this.players[playerId].game.right()
    }
    rotate(playerId) {
        this.players[playerId].game.rotate()
    }
    drop(playerId) {
        this.players[playerId].game.drop()
    }
    speed(playerId) {
        this.players[playerId].game.speed()
    }

    leave(playerId) {
        if (this.players[playerId]) {
            delete this.players[playerId]
            this.playersCount--
        }
    }

    get gamedata() {
        const data = {}

        for (let player of Object.values(this.players)) {
            if (player.game) {
                data[player.id] = {
                    username: player.username,
                    gamedata: player.game.renderGamedata,
                    isActive: this.isActive,
                    losed: player.losed,
                    wined: player.wined
                }
            }
        }

        return data
    }

    get object() {
        return {
            id: this.id,
            players: this.players,
            isFull: this.playersCount >= PLAYERS_LIMIT,
            isActive: this.isActive
        }
    }
}

module.exports = Room
