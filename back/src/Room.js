const Game = require('./Game')

const {
    PLAYERS_LIMIT,
    TICK_INTERVAL,
    SCORE_MULTIPLIER,
} = require('../config')

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
        this.withPenalty = false
    }

    penalty(playerId, count) {
        this.players[playerId].score += count * SCORE_MULTIPLIER

        if (!this.withPenalty) {
            return
        }

        for (let player of Object.values(this.players)) {
            if (player.id !== playerId)
                player.game.getPenalty(count * (this.playersCount - 1))
        }
    }

    start(infMode, withPenalty, tickCb, endCb) {
        if (this.isActive) {
            return
        }
        this.infMode = infMode
        this.withPenalty = withPenalty
        this.isActive = true

        for (let player of Object.values(this.players)) {
            if (player.game)
                player.game.start(this.penalty.bind(this, player.id))
        }
        this.tickCb = tickCb
        this.endCb = endCb

        this.interval = setInterval(() => this.tick(), TICK_INTERVAL)
    }

    stop() {
        if (!this.isActive) {
            return
        }
        this.isActive = false
        this.endCb()
        clearInterval(this.interval)
    }

    clearGame(){
        this.isActive = false
        this.infMode = false
        this.withPenalty = false
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
        if (this.isFull) {
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
    forward(playerId) {
        this.players[playerId].game.forward()
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
                    score: player.score,
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
