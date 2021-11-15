const {
    WIDTH,
    HEIGHT,
} = require('../config')

const generateGamedataRow = () => {
    const row = []
    for (let i = 0; i < WIDTH; i++) {
        row.push(0)
    }
    return row
}

const generateGamedata = () => {
    const gamedata = []
    for (let i = 0; i < HEIGHT; i++) {
        gamedata.push(generateGamedataRow())
    }
    return gamedata
}

module.exports = {
    generateGamedataRow,
    generateGamedata,
}
