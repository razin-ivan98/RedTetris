import { initStore } from '../../src/store/initStore'

describe('InitStore Test', () => {
    it('Should create store', () => {
        const store = initStore()

        expect(store).not.toBeFalsy()
    })

    // it('Should set username', () => {
    //     const store = initStore()
    //     store.setUsername('kek')
    //     expect(store.username).toBe('kek')
    // })
})
