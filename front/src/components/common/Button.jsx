import React from 'react'

export const Button = props => {
    const {
        children,
        onClick
    } = props

    return <button
        className="block button"
        onClick={ onClick }
    >
        { children }
    </button>
}
