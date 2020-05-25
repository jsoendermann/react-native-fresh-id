jest.mock('react-native-securerandom', () => ({
    generateSecureRandom: (length: number) => Array.from({ length }).map(() => Math.floor(Math.random() * 256)),
}))

import freshId from '.'

describe('fresh-id-node', () => {
    it('should create correct ids', async () => {
        expect(await freshId(20)).toMatch(/^[a-zA-Z0-9]{20}$/)
        expect(await freshId(100)).toMatch(/^[a-zA-Z0-9]{100}$/)
        expect(await freshId()).toMatch(/^[a-zA-Z0-9]{15}$/)
    })

    it('should log a warning when creating ids with < 15 chars.', async () => {
        const warn = jest.spyOn(console, 'warn').mockImplementation(jest.fn())

        await freshId(10)

        expect(warn).toHaveBeenCalledTimes(1)
        expect(warn).toHaveBeenLastCalledWith('Ids shorter than 15 characters are not recommended.')
    })

    it('should not create empty ids', async () => {
        expect.assertions(1)
        try {
            await freshId(0)
        } catch (error) {
            expect(error.message).toBe('Ids must be at least one character long.')
        }
    })
})
