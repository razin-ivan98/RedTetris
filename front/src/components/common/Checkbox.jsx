import React from 'react'

export const Checkbox = props => {
    const {
        checked,
        onClick
    } = props

    return <div className='checkboxWrapper' onClick={onClick} data-testid='checkbox' >
        { checked && <div className='checkbox' data-testid='checkbox-checked' /> }
    </div>
}
