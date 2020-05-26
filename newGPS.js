const SerialPort = require('serialport')
const SerialPortParser = require('@serialport/parser-readline')
const GPS = require('gps')

const port = new SerialPort('/dev/ttyS0', { baudRate: 9600 })
const gps = new GPS()

const parser = port.pipe(new SerialPortParser())


gps.on('data', data => {
	//if(!data.quality) return
	if(data.type) console.log(data.type)
	if(data.type == 'GGA') console.log('GGA')
	if(data.type == 'HDT') console.log('HDT')
})

gps.on('RMC', data => {
	if(!data.quality) return
	console.log(data)
})
gps.on('GGA', data => {
	if(!data.quality) return
	//console.log(data)
	//console.log('on GGA')
})
gps.on('HDT', data => {
	console.log('HDT' + data)
	if(!data.quality) return
	console.log(data)
})

//gps.on("data", data => {
//
//console.log(data.quality)
//	if(data.type == "HDT" && data.quality)	console.log(data)
//	if(data.type == "GGA") {
//		if(data.quality != null) {
//			console.log(data)
//		}
//	}
//})
console.log('callback of parser.on will start from now on')
parser.on('data', data => {
    gps.update(data)
})
