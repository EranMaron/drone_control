const PiCamera = require('pi-camera')
exports.myCamera = new PiCamera({
	mode: 'video',
	output: `${__dirname}/videos/video.h264`,
	width: 1920,
	height: 1080,
	timeout: 5000, // Record for 5 seconds
	nopreview: true
})
