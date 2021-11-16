import '@testing-library/jest-dom';
import ReactTestUtils from 'react-dom/test-utils'; 
import React from 'react';
import { render, screen } from '@testing-library/react'
import { Button } from '../../../src/components/common/Button';

describe('Button test', () => {
    it('Should render button', () => {
        render(<Button />)
        const button = screen.getByRole("button")
        expect(button).toBeInTheDocument()
    })

    it('Should render button with text', () => {
        render(<Button>text</Button>)
        const button = screen.getByText("text")
        expect(button).toBeInTheDocument()
    })

    it('Should handle click', () => {
        const onClick = jest.fn()
        const { container } = render(<Button onClick={onClick} />)
        ReactTestUtils.Simulate.click(container.firstChild)
        expect(onClick).toHaveBeenCalledTimes(1)
    })
})
