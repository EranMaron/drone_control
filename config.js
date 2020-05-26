const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
const port = 3000;
const dronePort = 8889;
const droneHost = "192.168.10.1";
const droneStatePort = 8890;
const dgram = require("dgram");
const drone = dgram.createSocket("udp4");
const droneState = dgram.createSocket("udp4");
const SerialPort = require('serialport')
const SerialPortParser = require('@serialport/parser-readline')
const GPS = require('gps')

const gpsPort = new SerialPort('/dev/ttyS0', {baudRate: 9600})
const gps = new GPS()

const parser = gpsPort.pipe(new SerialPortParser())

drone.bind(dronePort);
droneState.bind(droneStatePort);
// gps.bind(gpsPort)

module.exports = {
  express,
  app,
  server,
  io,
  port,
  dgram,
  dronePort,
  droneHost,
  drone,
  droneState,
  droneStatePort,
  parser,
  gps
};
