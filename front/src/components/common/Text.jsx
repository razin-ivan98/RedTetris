import React from 'react'
import './style.css'

export const Text = (props) => {
    const {
        children,
        ellipsis,
        className
    } = props

    const classNames = [className, 'text']

    if (ellipsis) {
        classNames.push('ellipsis')
    }

    return <p className={ classNames.join(' ') }>{ children }</p>
}
