'use strict'
module.exports = function(ultimate, opts = {}) {

    return (req, res, next) => {

        if (Array.isArray(opts.excludePaths) && opts.excludePaths.indexOf(req.originalUrl) !== -1) {
            return next()
        }

        const transaction = ultimate.startTransaction('')

        req.ultimate = ultimate

        res.on('finish', () => {
            transaction._name = `${req.method} ${req.route ? req.route.path : req.originalUrl}`
            transaction.setResult('' + res.statusCode)
            if (req.body) {
                transaction.addContext('body', req.body)
            }
            transaction.addContext('Response', {
                status_code: res.statusCode,
                http_version: res._header.substr(5, 3).trim(),
                headers: res.getHeaders(),
            })
            transaction.addContext('Request', {
                params: req.params,
                query: req.query,
                url: req.originalUrl
            })
            transaction.end()
            ultimate.flush()
        })
        return next()
    }
}