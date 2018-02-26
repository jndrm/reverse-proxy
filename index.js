const ReproxyServer = require('./dist/main').ReproxyServer

const server = new ReproxyServer()

server.add("::ffff:127.0.0.1", "139.129.76.44")

server.startAll()