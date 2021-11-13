export const bindArgs = (fn, ...args) => {
    return fn.bind(null, ...args)
}
