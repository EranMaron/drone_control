const _convertRadToDeg = (radAngle) => {
    return parseFloat(parseFloat(radAngle) * parseFloat(180 / Math.PI));
};

const _getAngle = (focalLength, Dxy) => {
    const radAngle = parseFloat(
        2 * Math.atan(parseFloat(Dxy / parseFloat(focalLength * 2)))
    );
    const degAngle = _convertRadToDeg(radAngle);
    return {radAngle, degAngle};
};

export const piCameraInfo = {
    focalLength: 3.6,
    xDimensions: 3.6,
    yDimensions: 2.7,
    horizontalDegree: _getAngle(3.6, 3.6),
    verticalDegree: _getAngle(3.6, 2.7),
};