import React from 'react'
import './style.css'

export const Text = (props) => {
    const {
        children
    } = props

    return <p className="text">{ children }</p>
}
