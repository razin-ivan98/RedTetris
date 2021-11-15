const assert = require('assert')
const { START_X, START_Y } = require('../config')

const Figure = require('../src/Figure')

describe('Figure test', () => {
    it('Should have start coords', () => {
        const figure = new Figure()

        assert.equal(figure.x, START_X)
        assert.equal(figure.y, START_Y)

    })

    describe('Rotate right', () => {
        it('Should correctly rotate to right if next state is not 0', () => {
            const figure = new Figure()
            figure.currentFigureKey = 0
            figure.currentShapeKey = 0

            figure.rotateRight()

            assert.equal(figure.currentShapeKey, 1)
        })

        it('Should correctly rotate to right if next state is 0', () => {
            const figure = new Figure()
            figure.currentFigureKey = 0
            figure.currentShapeKey = 3

            figure.rotateRight()

            assert.equal(figure.currentShapeKey, 0)
        })
    })
    
    describe('Rotate left', () => {
        it('Should correctly rotate to left if next state is not 0', () => {
            const figure = new Figure()
            figure.currentFigureKey = 0
            figure.currentShapeKey = 0

            figure.rotateLeft()

            assert.equal(figure.currentShapeKey, 3)
        })

        it('Should correctly rotate to left if next state is 0', () => {
            const figure = new Figure()
            figure.currentFigureKey = 0
            figure.currentShapeKey = 3

            figure.rotateLeft()

            assert.equal(figure.currentShapeKey, 2)
        })
    })

    it('Should return current view', () => {
        const figure = new Figure()
        figure.currentFigureKey = 0
        figure.currentShapeKey = 0

        const view = figure.figure

        assert.equal(view, figure.figureTemplates[0][0])
    })
})
