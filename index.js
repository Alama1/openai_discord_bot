'use strict'
process.title = 'Discord openai bot'

const app = require('./src/Application')

app
    .register()
    .then(() => {
        app.connect()
    })
    .catch(err => {
        console.error(err)
    })
