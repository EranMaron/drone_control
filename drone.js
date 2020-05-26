const throttle = require('lodash/throttle')
const {drone, droneHost, dronePort, droneState, io, parser, gps} = require('./config')
const {calculateQuarter, calcDstCoordinate} = require('./navigation')
// const gps = require('./gps')

const keepAlive = () => {
	drone.send('command', 0, 7, dronePort, droneHost, err => {
		if (err) console.log(err)
	})
}

const parseState = state => {
	return state.split(';').map(x => x.split(':')).reduce((data, [key, value]) => {
		data[key] = value
		return data
	}, {})
}

let commandInterval = setInterval(keepAlive, 10000)

let formattedState = {}
let gpsObj = {}
let telemetry = {}

const commandDelays = {
	command: 500,
	takeoff: 5000,
	land: 5000,
	up: 7000,
	down: 7000,
	left: 5000,
	go: 7000,
	right: 5000,
	forward: 5000,
	back: 5000,
	cw: 5000,
	ccw: 5000,
	flip: 3000,
	speed: 3000,
	'battery?': 500,
	'speed?': 500,
	'time?': 500,
};

const sleep = (milliseconds) => {
	return new Promise(resolve => setTimeout(resolve, milliseconds))
}

// * App connection
io.on('connection', socket => {
	console.log("App connected to server...")
	//* Getting commands
	socket.on('command', command => {
		const {type, distance, degree, x, y} = command;
		const {yaw, latitude, longitude} = telemetry
		const actualAngle = degree - yaw
		console.log("type:", type);
		console.log("x:", x);
		console.log("y:", y);
		switch (type) {
			case "command":
				drone.send('command', 0, 7, dronePort, droneHost, err => {
					if (err) console.log(err)
				})
				socket.emit('allTelemetry', telemetry)
				break;
			case "takeoff":
				drone.send(type, 0, type.length, dronePort, droneHost, err => {
					if (err) console.log(err)
				})
				break;
			case "land":
				drone.send(type, 0, type.length, dronePort, droneHost, err => {
					if (err) console.log(err)
				})
				// commandInterval = clearInterval(commandInterval)
				break;
			case "press":
				const commands = calculateQuarter(x, y);
				console.log("commands:", commands);
				for (let i = 0; i < commands.length; i++) {
					const command = `${commands[i].direction} ${commands[i].distance}`
					drone.send(command, 0, command.length, dronePort, droneHost, err => {
						if (err) console.log(err)
					})
					sleep(commandDelays[commands[i].direction])
				}
				// for taking care of gps validation
				const coords = calcDstCoordinate(distance, actualAngle, {latitude, longitude})
				console.log("coords:", coords);
				break;
			case "left":
			case "right":
			case "back":
			case "forward":
			case "up":
			case "down":
				const command = `${type} 50`
				console.log("command:", command);
				drone.send(command, 0, command.length, dronePort, droneHost, err => {
					if (err) console.log(err)
				})
				sleep(commandDelays[type])
				break;
			case "emergency":
				drone.send(type, 0, type.length, dronePort, droneHost, err => {
					if (err) console.log(err)
				})
				break;
			default:
				console.log("type default:", type);
				break;

		}
	})

	//* Get OK/Error from drone
	drone.on('message', message => {
		console.log(`Drone Feedback: ${message}`)
	})
	
	droneState.on("message", throttle(state => {
		formattedState = parseState(state.toString())
		// drone.send("wifi?", 0, 5, dronePort, droneHost, err => {
		// 	if (err) console.log(err)
		// })
		telemetry = {
			batStatus: formattedState.bat,
			yaw: formattedState.yaw,
			height: formattedState.h,
			...gpsObj
		}
		socket.emit('allTelemetry', telemetry)
		console.log(telemetry)
	}, 1000))
})

//* Send telemetry to app


gps.on("data", data => {
	// console.log(data.quality)
	if (data.type == "GGA") {
		if (data.quality != null) {
			gpsObj = {
				latitude: data.latitude,
				longitude: data.longitude,
			}
		}
	}
})

parser.on('data', data => {
	gps.update(data)
})
