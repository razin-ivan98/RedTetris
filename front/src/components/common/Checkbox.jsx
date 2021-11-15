import React from 'react'

export const Checkbox = props => {
    const {
        checked,
        onClick
    } = props

    return <div className='checkboxWrapper' onClick={onClick}>
        { checked && <div className='checkbox' /> }
    </div>
}
