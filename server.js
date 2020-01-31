const http = require('http')
const port = 1337


const app = require('./app')


http.createServer(app).listen(port)