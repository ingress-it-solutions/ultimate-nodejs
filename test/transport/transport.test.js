const tap = require('tap')
const ultimate = require('../../index')({
    ingestionKey: '',
    enable: false
})

async function transport_test(throwError = false) {
    tap.equal(ultimate.conf.url === 'www.palzin.app', true)

    const transaction = ultimate.startTransaction('foo')
    tap.equal(ultimate.currentTransaction().hash === transaction.hash, true)

    const segment = await ultimate.addSegment(
        async(segment) => {
            await wait(3000)
            const arr = Array(1e6).fill('some string')
            arr.reverse()
            return segment
        },
        'test async',
        'test label',
    )

    transaction.end()
    ultimate.flush()

    tap.equal(ultimate.isRecording(), false)
    tap.equal(ultimate.currentTransaction(), null)
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

transport_test()