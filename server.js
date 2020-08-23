const { server, port } = require('./config')

server.listen(port, () => console.log('server running on port:' + port))
