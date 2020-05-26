// const SerialPort = require('serialport')
// const SerialPortParser = require('@serialport/parser-readline')
// const GPS = require('gps')

// const {gpsCoord, io} = require('./config')


// const port = new SerialPort('/dev/ttyS0', { baudRate: 9600 })
// const gps = new GPS()

// const parser = port.pipe(new SerialPortParser())

let gpsObj

// gps.on("data", data => {
// console.log(data.quality)
// 	if(data.type == "GGA") {
// 		if(data.quality != null) {
// 			gpsObj = {
// 				lat: data.latitude,
// 				lon: data.longitude,
// 				alt: data.altitude
// 			}
// 		}
// 		io.on('connection', socket => {
// 			io.sockets.emit("gpsCoord", gpsObj)
// 		})
// 	}
// })

// parser.on('data', data => {
//     gps.update(data)
// })


// exports.getGPSCoord = getGPSCoord


// module.exports = { getGPSCoord }
