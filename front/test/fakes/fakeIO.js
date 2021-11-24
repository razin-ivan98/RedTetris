export const getFakeIO = () => {
    const handlers = {}
    const events = {}

    const on = (event, fn) => {
        handlers[event] = fn
    }
    const emit = (event, data) => {
        events[event] = event
    }

    return {
        handlers,
        events,
        on,
        emit
    }
}
