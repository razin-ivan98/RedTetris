import React from 'react'
import './style.css'

export const Input = (props) => {
    const {
        value,
        onChange,
        placeholder
    } = props

    const handleChange = e => {
        if (onChange) {
            onChange(e.target.value)
        }
    }

    return <input
        className='block input'
        type='text'
        value={ value }
        placeholder={ placeholder }
        onChange={ handleChange }
    />
}
