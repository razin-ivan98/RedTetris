import '@testing-library/jest-dom'
import ReactTestUtils from 'react-dom/test-utils'
import React from 'react';
import { render, screen } from '@testing-library/react'
import { LobbyPage } from '../../src/pages/LobbyPage'


describe('LobbyPage test', () => {
    it('Should render LobbyPage', () => {
        const store = {
            username: 'name',
            getRooms() {}
        }
        const { container } = render(<LobbyPage store={store} />)
        expect(container.firstChild).toBeInTheDocument()
    })

    it('Should crete new room', () => {
        const store = {
            username: 'name',
            getRooms() {},
            createRoom: jest.fn()
        }
        render(<LobbyPage store={store} />)
        const createRoomButton = screen.getByText('Create room')
        ReactTestUtils.Simulate.click(createRoomButton)
        expect(store.createRoom).toBeCalledTimes(1)
    })

    it('Should join room', () => {
        const store = {
            username: 'name',
            getRooms() {},
            rooms: [
                {
                    id: 2,
                    players: [{ id: 1, username: 'player' }],
                    isFull: false,
                    isStarted: false
                }
            ],
            joinRoom: jest.fn()
        }
        render(<LobbyPage store={store} />)
        const room = screen.getByText('player')
        ReactTestUtils.Simulate.click(room)
        expect(store.joinRoom).toBeCalledTimes(1)
    })

    it('Should not join room (isFull)', () => {
        const store = {
            username: 'name',
            getRooms() {},
            rooms: [
                {
                    id: 2,
                    players: [{ id: 1, username: 'player' }],
                    isFull: true,
                    isStarted: false
                }
            ],
            joinRoom: jest.fn()
        }
        render(<LobbyPage store={store} />)
        const room = screen.getByText('player')
        ReactTestUtils.Simulate.click(room)
        expect(store.joinRoom).toBeCalledTimes(0)
    })

    it('Should not join room (isActive)', () => {
        const store = {
            username: 'name',
            getRooms() {},
            rooms: [
                {
                    id: 2,
                    players: [{ id: 1, username: 'player' }],
                    isFull: false,
                    isStarted: true
                }
            ],
            joinRoom: jest.fn()
        }
        render(<LobbyPage store={store} />)
        const room = screen.getByText('player')
        ReactTestUtils.Simulate.click(room)
        expect(store.joinRoom).toBeCalledTimes(0)
    })
})
