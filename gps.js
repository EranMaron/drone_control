const SerialPort = require('serialport')
const SerialPortParser = require('@serialport/parser-readline')
const GPS = require('gps')

const port = new SerialPort('/dev/ttyS0', { baudRate: 9600 })
const gps = new GPS()

const parser = port.pipe(new SerialPortParser())

gps.on("data", data => {
console.log(data.quality)
	if(data.type == "GGA") {
		if(data.quality != null) {
			console.log(data)
		}
	}
})

parser.on('data', data => {
    gps.update(data)
})
