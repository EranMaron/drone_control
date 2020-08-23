const turf = require("turf");

module.exports = {
  calcDstCoordinate: (distance, actualAngle, centerPoint) => {
    const distanceInMeters = distance / 100;
    const center = turf.point([centerPoint.longitude, centerPoint.latitude]);
    const destination = turf.destination(center, distanceInMeters, actualAngle);
    return {
      lat: destination.geometry.coordinates[1],
      lon: destination.geometry.coordinates[0],
    };
  },

  calculateQuarter: ({ x, y }) => {
    let commands = [];
    if (x <= -20) {
      commands.push({ direction: "left", distance: Math.floor(x * -1) });
    } else if (x >= 20) {
      commands.push({ direction: "right", distance: Math.floor(x) });
    }
    if (y <= -20) {
      commands.push({ direction: "back", distance: Math.floor(y * -1) });
    } else if (y >= 20) {
      commands.push({ direction: "forward", distance: Math.floor(y) });
    }
    return commands;
  },

  calculateDstByCoords: (srcCoords, dstCoords) => {
    const point1 = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Point",
        coordinates: [srcCoords.latitude, srcCoords.longitude],
      },
    };
    const point2 = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Point",
        coordinates: [dstCoords.latitude, dstCoords.longitude],
      },
    };
    return turf.distance(point1, point2, "meters");
  },
};
