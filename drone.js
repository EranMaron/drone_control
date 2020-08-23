const throttle = require("lodash/throttle");
const {
  drone,
  droneHost,
  dronePort,
  io,
  parser,
  gps,
  droneState,
} = require("./config");
const {
  calculateQuarter,
  calcDstCoordinate,
  calculateDstByCoords,
} = require("./navigation");

const parseState = (state) => {
  return state
    .split(";")
    .map((x) => x.split(":"))
    .reduce((data, [key, value]) => {
      data[key] = value;
      return data;
    }, {});
};

let formattedState = {};
let gpsObj = {};
let telemetry = {};
let socketGlob = null;
const allowedDeviationInMeters = 3;

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
  "battery?": 500,
  "speed?": 500,
  "time?": 500,
};

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

const fixDroneLocation = async (destCoords) => {
  const distance = calculateDstByCoords(
    { latitude: gpsObj.latitude, longitude: gpsObj.longitude },
    destCoords
  );
  if (distance >= allowedDeviationInMeters) {
    const fixCommands = calculateQuarter(distance);
    for (let i = 0; i < fixCommands.length; i++) {
      const command = `${fixCommands[i].direction} ${fixCommands[i].distance}`;
      drone.send(command, 0, command.length, dronePort, droneHost, (err) => {
        if (err) console.log(err);
      });
      await sleep(commandDelays[fixCommands[i].direction]);
    }
    await fixDroneLocation();
  }
};

io.on("connection", (socket) => {
  socketGlob = socket;
  socket.on("start", async () => {
    drone.send("command", 0, 7, dronePort, droneHost, (err) => {
      if (err) console.log(err);
    });
    try {
      const exec = require("child_process").exec;
      const startStreaming = await exec("../straming.sh");
      startStreaming.stdout.on("data", (data) => {
        console.log("Streaming Running...");
      });
    } catch (err) {
      console.log("Error while running Streaming!!!", err);
    }

    socket.emit("allTelemetry", telemetry);
  });
  socket.on("command", async (command) => {
    const { type, distance, degree, x, y } = command;
    const { yaw, latitude, longitude } = telemetry;
    const actualAngle = degree - yaw;
    switch (type) {
      case "takeoff":
        drone.send(type, 0, type.length, dronePort, droneHost, (err) => {
          if (err) console.log(err);
        });
        break;
      case "land":
        drone.send(type, 0, type.length, dronePort, droneHost, (err) => {
          if (err) console.log(err);
        });
        break;
      case "press":
        const commands = calculateQuarter({ x, y });
        for (let i = 0; i < commands.length; i++) {
          const command = `${commands[i].direction} ${commands[i].distance}`;
          drone.send(
            command,
            0,
            command.length,
            dronePort,
            droneHost,
            (err) => {
              if (err) console.log(err);
            }
          );
          await sleep(commandDelays[commands[i].direction]);
        }
        const destCoords = calcDstCoordinate(distance, actualAngle, {
          latitude,
          longitude,
        });
        await fixDroneLocation(destCoords);
        break;
      case "left":
      case "right":
      case "back":
      case "forward":
      case "down":
        const generalCommand = `${type} 100`;
        drone.send(
          generalCommand,
          0,
          generalCommand.length,
          dronePort,
          droneHost,
          (err) => {
            if (err) console.log(err);
          }
        );
        sleep(commandDelays[type]);
        break;
      case "up":
        const upCommand = `${type} 200`;
        drone.send(
          upCommand,
          0,
          upCommand.length,
          dronePort,
          droneHost,
          (err) => {
            if (err) console.log(err);
          }
        );
        sleep(commandDelays[type]);
        break;
      case "emergency":
        drone.send(type, 0, type.length, dronePort, droneHost, (err) => {
          if (err) console.log(err);
        });
        break;
      default:
        break;
    }
  });

  droneState.on(
    "message",
    throttle((state) => {
      console.log(telemetry);
      formattedState = parseState(state.toString());
      drone.send("wifi?", 0, 5, dronePort, droneHost, (err) => {
        if (err) console.log(err);
      });
      telemetry = {
        batStatus: formattedState.bat,
        yaw: formattedState.yaw,
        height: formattedState.h,
        ...gpsObj,
      };
      socket.emit("allTelemetry", telemetry);
    }, 1000)
  );
});

gps.on("data", (data) => {
  if (data.type == "GGA") {
    if (data.quality != null) {
      gpsObj = {
        latitude: data.lat,
        longitude: data.lon,
      };
    }
  }
});

parser.on("data", (data) => {
  gps.update(data);
});
