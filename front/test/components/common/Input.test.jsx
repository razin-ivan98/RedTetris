import '@testing-library/jest-dom';
import ReactTestUtils from 'react-dom/test-utils'; 
import React from 'react';
import { render, screen } from '@testing-library/react'
import { Input } from '../../../src/components/common/Input';

describe('Input test', () => {
    it('Should render input', () => {
        render(<Input />)
        const input = screen.getByRole('textbox')
        expect(input).toBeInTheDocument()
    })

    it('Should render input with text', () => {
        render(<Input value="kek" />)
        const input = screen.getByDisplayValue('kek')
        expect(input).toBeInTheDocument()
    })

    it('Should render input with placholder', () => {
        render(<Input placeholder='lol' />)
        const input = screen.getByPlaceholderText('lol')
        expect(input).toBeInTheDocument()
    })

    it('Should handle change', () => {
        const onChange = jest.fn()
        const { container } = render(<Input onChange={onChange} />)
        ReactTestUtils.Simulate.change(container.firstChild, { target: { value: 'kek' } })
        expect(onChange).toHaveBeenCalledTimes(1)
    })

    it('Should not handle change (without onChange fn)', () => {
        const value = '2'
        const { container } = render(<Input value={value} />)
        ReactTestUtils.Simulate.change(container.firstChild, { target: { value: 'kek' } })
        expect(value).toBe('2')
    })
})
