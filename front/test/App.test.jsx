import '@testing-library/jest-dom';
import ReactTestUtils from 'react-dom/test-utils'; 
import React from 'react';
import { render, screen } from '@testing-library/react'
import App from '../src/App'

describe('App test', () => {
    it('Should render app', () => {
        const store = {
            username: 'name',
            getRooms() {},
        }
        const { container } = render(<App store={store} />)
        expect(container.firstChild).toBeInTheDocument()
    })

    it('Should redirect to lobby (username not null)', () => {
        const store = {
            username: 'name',
            getRooms() {},
        }
        render(<App store={store} />)
        const text = screen.getByText('Choose room or create your own one')
        expect(text).toBeInTheDocument()
    })
})
