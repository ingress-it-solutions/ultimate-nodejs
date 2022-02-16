'use strict'
const Ultimate = require('./src/ultimate')

module.exports = (conf = {}) => {
    return new Ultimate(conf)
}