import { getFakeIO } from '../../fakes/fakeIO'
import { initApi } from '../../../src/store/api/api'

describe('InitApi Test', () => {
    it('Should create api', () => {
        const io = getFakeIO()
        const api = initApi(io, {})

        expect(api).not.toBeFalsy()
    })

    describe('Incoming requests test', () => {
        it('Should handle login', () => {
            const io = getFakeIO()
            const setUsername = jest.fn()
            const api = initApi(io, { setUsername })
            io.handlers['login']({ username: 'name', id: 'id' })
            expect(setUsername).toBeCalledTimes(1)
        })
        it('Should handle getRooms', () => {
            const io = getFakeIO()
            const setRooms = jest.fn()
            const api = initApi(io, { setRooms })
            io.handlers['getRooms']({ rooms: {} })
            expect(setRooms).toBeCalledTimes(1)
        })
        it('Should handle join', () => {
            const io = getFakeIO()
            const setCurrentRoom = jest.fn()
            const api = initApi(io, { setCurrentRoom })
            io.handlers['join']({ roomId: 'id' })
            expect(setCurrentRoom).toBeCalledTimes(1)
        })
        it('Should handle gamedata', () => {
            const io = getFakeIO()
            const setGamedata = jest.fn()
            const api = initApi(io, { setGamedata })
            io.handlers['gamedata']({ gamedata: {} })
            expect(setGamedata).toBeCalledTimes(1)
        })
    })

    describe('Outcoming requests test', () => {
        it('Should handle login', () => {
            const io = getFakeIO()
            const api = initApi(io, {})
            api.login({})
            expect(io.events['login']).not.toBeFalsy()
        })
        it('Should handle join', () => {
            const io = getFakeIO()
            const api = initApi(io, {})
            api.joinRoom({})
            expect(io.events['joinRoom']).not.toBeFalsy()
        })
        it('Should handle create Room', () => {
            const io = getFakeIO()
            const api = initApi(io, {})
            api.createRoom({})
            expect(io.events['createRoom']).not.toBeFalsy()
        })
        it('Should handle getting Rooms', () => {
            const io = getFakeIO()
            const api = initApi(io, {})
            api.getRooms({})
            expect(io.events['getRooms']).not.toBeFalsy()
        })
        it('Should handle starting GAme', () => {
            const io = getFakeIO()
            const api = initApi(io, {})
            api.startGame({})
            expect(io.events['startGame']).not.toBeFalsy()
        })
        it('Should handle game action', () => {
            const io = getFakeIO()
            const api = initApi(io, {})
            api.gameAction({})
            expect(io.events['gameAction']).not.toBeFalsy()
        })
        it('Should handle leaving room', () => {
            const io = getFakeIO()
            const api = initApi(io, {})
            api.leaveRoom({})
            expect(io.events['leaveRoom']).not.toBeFalsy()
        })
    })
})
