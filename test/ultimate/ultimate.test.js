const tap = require('tap')

const ultimate = require('../../index')({
    ingestionKey: '',
    enable: false
})

async function ultimate_test(throwError = false) {
    tap.equal(ultimate.conf.url === 'www.palzin.app', true)

    const transaction = ultimate.startTransaction('foo')
    tap.equal(ultimate.currentTransaction().hash === transaction.hash, true)

    const segment = await ultimate.addSegment(
        async(segment) => {
            await wait(500)
            const arr = Array(1e6).fill('some string')
            arr.reverse()
            return segment
        },
        'test async',
        'test label',
    )

    let errorThrowed = false
    let segmentEx = null
    try {
        segmentEx = await ultimate.addSegment(
            async(segment) => {
                throw new Error('generic error')
            },
            'test async',
            'test label',
            throwError
        )
    } catch (e) {
        errorThrowed = true
    }

    transaction.end()
    if (throwError) {
        tap.equal(errorThrowed, true)
    } else {
        tap.equal(errorThrowed, false)
    }

    ultimate.flush()

    tap.equal(ultimate.isRecording(), false)
    tap.equal(ultimate.currentTransaction(), null)
}

function ultimate_test_transactionNotEnd() {
    const transaction = ultimate.startTransaction('foo')

    tap.equal(ultimate.currentTransaction().hash === transaction.hash, true)

}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

ultimate_test()
ultimate_test(true)
ultimate_test_transactionNotEnd()