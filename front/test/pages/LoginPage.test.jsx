import '@testing-library/jest-dom';
import ReactTestUtils from 'react-dom/test-utils'; 
import React from 'react';
import { render, screen } from '@testing-library/react'
import { LoginPage } from '../../src/pages/LoginPage';

describe('LoginPage test', () => {
    it('Should render LobbyPage', () => {
        const store = {}
        const { container } = render(<LoginPage store={store} />)
        expect(container.firstChild).toBeInTheDocument()
    })

    it('Should render LobbyPage', () => {
        const store = {}
        const { container } = render(<LoginPage store={store} />)
        expect(container.firstChild).toBeInTheDocument()
    })

    it('Should change username', () => {
        const store = {}
        render(<LoginPage store={store} />)
        let input = screen.getByRole('textbox')
        ReactTestUtils.Simulate.change(input, { target: { value: 'kek' } })
        input = screen.getByDisplayValue('kek')
        expect(input).toBeInTheDocument()
    })

    it('Should login', () => {
        const store = {
            login: jest.fn()
        }
        render(<LoginPage store={store} />)
        const input = screen.getByRole('textbox')
        ReactTestUtils.Simulate.change(input, { target: { value: 'kek' } })
        const button = screen.getByText('LOGIN')
        ReactTestUtils.Simulate.click(button)
        expect(store.login).toBeCalledTimes(1)
    })

    it('Should not login (no store)', () => {
        render(<LoginPage />)
        const input = screen.getByRole('textbox')
        ReactTestUtils.Simulate.change(input, { target: { value: 'kek' } })
        const button = screen.getByText('LOGIN')
        ReactTestUtils.Simulate.click(button)
    })

    it('Should not login (no username)', () => {
        const store = {
            login: jest.fn()
        }
        render(<LoginPage store={store} />)
        const button = screen.getByText('LOGIN')
        ReactTestUtils.Simulate.click(button)
        expect(store.login).toBeCalledTimes(0)
    })
})
