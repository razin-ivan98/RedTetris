import '@testing-library/jest-dom';
import ReactTestUtils from 'react-dom/test-utils'; 
import React from 'react';
import { render, screen } from '@testing-library/react'
import { RoomPage } from '../../src/pages/RoomPage';
import { getFakeEventListener } from '../fakes/fakeEventListerer';


describe('RoomPage test', () => {
    it('Should render RoomPage', () => {
        const store = {
            username: 'name'
        }
        const { container } = render(<RoomPage store={store} />)
        expect(container.firstChild).toBeInTheDocument()
    })

    it('Should start game', () => {
        const store = {
            username: 'name',
            id: '2',
            currentRoom: '2',
            startGame: jest.fn()
        }
        render(<RoomPage store={store} />)
        const startButton = screen.getByText('Start')
        ReactTestUtils.Simulate.click(startButton)
        expect(store.startGame).toHaveBeenCalledTimes(1)
    })

    it('Should start game in inf mode', () => {
        const store = {
            username: 'name',
            id: '2',
            currentRoom: '2',
            gamedata: {
                '2': {},
                '3': {}
            },
            startGame: jest.fn()
        }
        render(<RoomPage store={store} />)
        const startButton = screen.getByText('Start Inf Mode')
        ReactTestUtils.Simulate.click(startButton)
        expect(store.startGame).toHaveBeenCalledTimes(1)
    })

    it('Should render other player`s gamedata', () => {
        const store = {
            username: 'name',
            id: '2',
            gamedata: {
                '2': {},
                '3': {}
            }
        }
        render(<RoomPage store={store} />)
        const scores = screen.getAllByTestId('game')
        expect(scores.length).toBe(2)
    })

    it('Should handle changing withPenalty checkbox', () => {
        const store = {
            username: 'name',
            id: '2',
            currentRoom: '2',
            gamedata: {
                '2': {},
                '3': {}
            }
        }
        render(<RoomPage store={store} />)
        const checkbox = screen.getByTestId('checkbox')
        ReactTestUtils.Simulate.click(checkbox)
        const checked = screen.getByTestId('checkbox-checked')
        expect(checked).toBeInTheDocument()
    })

    it('Should not handle Arrow Left keydown (no gamedata)', () => {
        const store = {
            username: 'name',
            id: '2',
            currentRoom: '2',
            gameAction: jest.fn()
        }
        const events = getFakeEventListener()
        render(<RoomPage store={store} />)
        events.keydown({ code: 'ArrowLeft' })
        expect(store.gameAction).toHaveBeenCalledTimes(0)
    })

    it('Should handle Arrow Left keydown', () => {
        const store = {
            username: 'name',
            id: '2',
            currentRoom: '2',
            gamedata: {
                '2': {
                    isActive: true
                }
            },
            gameAction: jest.fn()
        }
        const events = getFakeEventListener()
        render(<RoomPage store={store} />)
        events.keydown({ code: 'ArrowLeft' })
        expect(store.gameAction).toHaveBeenCalledTimes(1)
    })
})
