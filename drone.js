const { drone, droneHost, dronePort, io, fs } = require('./config')

const keepAlive = () => {
	console.log("Keep a live")
	drone.send('command', 0, 7, dronePort, droneHost, err => {
		if (err) console.log(err)
	})
}

//drone.on("message", message => {
//		console.log(`Rceived Message: toString(${message})`)
//	}


let commandInterval

io.on('connection', socket => {
	console.log("New Connection...")
	socket.on('command', command => {
		console.log(command)
		if (command === 'takeoff') commandInterval = setInterval(keepAlive, 10000)
		if (command === 'land') clearInterval(commandInterval)
		drone.send(command, 0, command.length, dronePort, droneHost, err => {
			if (err) console.log(err)
		})
		//socket.emit('command', command)
	})
	drone.on('message', message => {
		console.log(`received message: ${message}`)
	})
})
