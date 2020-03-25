const { drone, droneHost, dronePort, io, fs } = require('./config')
// const { myCamera } = require('./camera')

drone.send('command', 0, 7, dronePort, droneHost, (err, success) => {
	if (err) {
		console.log(err)
	}
})

const keepAlive = () => {
	drone.send('command', 0, 7, dronePort, droneHost, err => {
		if (err) console.log(err)
	})
}

let commandInterval
io.on('connection', socket => {
	socket.on('command', command => {
		if (command === 'takeoff') commandInterval = setInterval(keepAlive, 10000)
		if (command === 'land') clearInterval(commandInterval)
		console.log(command)
		drone.send(command, 0, command.length, dronePort, droneHost, err => {
			if (err) console.log(err)
		})
		io.emit('command', command)
	})
	socket.on('verifyConnection', message => {
		console.log(`received message: ${message}`)
	})
})

// let streamInterval
// io.on('connection', socket => {
// 	socket.on('video', () => {
// 		streamInterval = setInterval(() => {
// 			const frame = wCap.read()
// 			const image = cv.imencode('.jpg', frame).toString('base64')
// 			io.emit('video', image)
// 		}, 1000 / FPS)
// 	})
// })
