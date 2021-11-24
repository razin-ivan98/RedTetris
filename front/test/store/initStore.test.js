import { initStore } from '../../src/store/initStore'

describe('InitStore Test', () => {
    it('Should create store', () => {
        const store = initStore()

        expect(store).not.toBeFalsy()
    })
})
