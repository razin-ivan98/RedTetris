const assert = require('assert')
const Figure = require('../src/Figure')
const Game = require('../src/Game')

describe('Game test', () => {
    it ('Should stop game', () => {
        const game = new Game()

        game.stop()

        assert.equal(game.isActive, false)
    })

    describe('Tick test', () => {
        it('Should not do anything (is not active)', () => {
            const game = new Game()

            const status = game.tick()

            assert.equal(status, false)
        })

        it('Should spawn new figure and render it', () => {
            const game = new Game()
            game.isActive = true
            game.currentFigure = false

            game.tick()

            assert(game.currentFigure)
        })

        it('Should spawn figure and stop game (lose) and render', () => {
            const game = new Game()
            game.gamedata[0] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            game.gamedata[1] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            game.gamedata[2] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            game.isActive = true
            game.currentFigure = false

            game.tick()

            assert(game.currentFigure)
            assert.equal(game.isActive, false)
        })

        it('Should fix figure and null it (figure is not active)', () => {
            const game = new Game()
            game.currentFigure = new Figure()
            game.currentFigure.currentFigureKey = 0
            game.currentFigure.currentShapeKey = 0
            game.currentFigure.isActive = false
            game.isActive = true

            game.tick()

            assert.equal(game.currentFigure, null)
            assert.deepEqual(game.gamedata[1], [0, 0, 0, 1, 1, 1, 1, 0, 0, 0])
        })

        it('Should move figure down and render', () => {
            const game = new Game()
            game.currentFigure = new Figure()
            game.currentFigure.currentFigureKey = 0
            game.currentFigure.currentShapeKey = 0
            game.isActive = true

            game.tick()

            assert.equal(game.currentFigure.y, 1)
            assert.deepEqual(game.renderGamedata[2], [0, 0, 0, 1, 1, 1, 1, 0, 0, 0])
        })

        it('Should deactivate figure (can not move down) and render', () => {
            const game = new Game()
            game.currentFigure = new Figure()
            game.currentFigure.currentFigureKey = 0
            game.currentFigure.currentShapeKey = 0
            game.gamedata[2] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            game.isActive = true

            game.tick()

            assert.equal(game.currentFigure.y, 0)
            assert.equal(game.currentFigure.isActive, false)
            assert.deepEqual(game.renderGamedata[1], [0, 0, 0, 1, 1, 1, 1, 0, 0, 0])
        })
    })

    describe('checkRows test', () => {
        it('Should delete bottom row (filled)', () => {
            const game = new Game()
            game.gamedata[19] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]

            game.checkRows()

            assert.deepEqual(game.gamedata[19], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
        })
    })
    
    
})
