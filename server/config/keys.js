process.env.NODE_MODE = 'production'

if(process.env.NODE_MODE == 'dev') {
    module.exports = require('./dev')
} else if(process.env.NODE_MODE == 'production') {
    module.exports = require('./production')
}