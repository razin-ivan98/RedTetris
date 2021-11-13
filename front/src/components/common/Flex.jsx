import React from 'react'
import './style.css'

export const Flex = (props) => {
    const {
        justify = 'between',
        direction = 'row',
        children,
        alignItems = 'stretch',
        className,
        withoutGap
    } = props

    const classNames = [className]

    classNames.push(direction === 'column' ? 'flex-column' : 'flex-row')

    switch (alignItems) {
        case 'center':
            classNames.push('flex-align-center')
            break
        case 'start':
            classNames.push('flex-align-start')
            break
        case 'stretch':
            classNames.push('flex-align-stretch')
            break
        default:
            break
    }

    switch (justify) {
        case 'center':
            classNames.push('flex-justify-center')
            break
        case 'start':
            classNames.push('flex-justify-start')
            break
        case 'between':
            classNames.push('flex-justify-between')
            break
        default:
            break
    }

    if (!withoutGap) {
        classNames.push('flex-gap')
    }
    
    return <div
        className={classNames.join(' ')}
    >
        { children }
    </div>
}
