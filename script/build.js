#!/usr/bin/env node

require('dotenv').config({
    path: '../.env'
})

const fs = require('fs')

const config = {
    "MAK": process.env.MAPBOX_API_KEY,
    "GAK": process.env.GOOGLE_API_KEY
}

console.log(JSON.stringify(config, null, 4))

fs.writeFileSync('../public/config.json', JSON.stringify(config, null, 4))

