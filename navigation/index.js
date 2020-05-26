const turf = require('turf');

module.exports = {

    calcDstCoordinate : (distance, actualAngle, centerPoint) => {
        const distanceInMeters = distance / 100;
        const center = turf.point([centerPoint.longitude, centerPoint.latitude]);
        const destination = turf.destination(
            center,
            distanceInMeters,
            actualAngle
        );
        return {
            lat: destination.geometry.coordinates[1],
            lon: destination.geometry.coordinates[0],
        };
    },
    
   getNumOfMoovementCommands:(distance) => {
        let commands = [];
        for (let i = 0; i < Math.floor(distance / 500); i++) {
            commands.push({distanceInCm: 500});
        }
        const modulo = distance % 500;
        if (modulo) {
            commands.push({distanceInCm: distance % 500});
        }
        return commands;
    },
    
    calculateQuarter : (x, y) => {
        let commands = [];
        // if (x < 0 && x > -20) {
        //     commands.push({direction: 'left', distance: 20})
        // }
        if (x <= -20) {
            commands.push({direction: 'left', distance: x * -1})
        }
        // else if (x > 0 && x < 20) {
        //     commands.push({direction: 'right', distance: 20})
        // }
        else if (x >= 20) {
            commands.push({direction: 'right', distance: x})
        }
       
        // if (y < 0 && y > -20) {
        //     commands.push({direction: 'back', distance: 20})
        // }
        if (y <= -20) {
            commands.push({direction: 'back', distance: y * -1})
        }
        // else if (y > 0 && y < 20) {
        //     commands.push({direction: 'forward', distance: 20})
        // }
        else if (y >= 20) {
            commands.push({direction: 'forward', distance: y})
        }
        return commands;
    }
}