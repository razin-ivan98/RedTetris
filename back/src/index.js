const Server = require('./Server')

const wsServer = new Server()

wsServer.initRoutes()
wsServer.listen()
