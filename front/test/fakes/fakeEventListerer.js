export const getFakeEventListener = () => {
    const events = {}
    document.addEventListener = (event, callback) => {
        events[event] = callback;
    }

    return events
}
