var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

var latency = [];
var previousLatency = [];
var totalJitter = [];
var jitter = [];
var jitterSampleSize = [];

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", function (socket) {
  console.log("a user connected");
  socket.on("disconnect", function () {
    console.log("user disconnected");
  });

  socket.on("latencyTest", function () {
    console.log("latencyTest");
    socket.emit("latencyResp");
  });

  socket.on("push latency", function (appName, latest) {
    console.log("previous latency: " + previousLatency[appName]);
    console.log("latest latency: " + latest);
    console.log("previous jitter: " + jitter[appName]);

    latency[appName] = latest;

    if (jitterSampleSize[appName] === undefined) {
      jitterSampleSize[appName] = 1;
      totalJitter[appName] = 0;
    } else {
      totalJitter[appName] = totalJitter[appName] + Math.abs(latest - previousLatency[appName]);
      jitter[appName] = Math.round(totalJitter[appName] / jitterSampleSize[appName]);
      jitterSampleSize[appName]++;
    }

    previousLatency[appName] = latest;
    console.log("latest jitter: " + jitter[appName]);

    socket.emit("push latency", {
      'latency': latency[appName],
      'jitter': jitter[appName]
    });
  });

  socket.on("get latency", function (appName) {
    console.log("get latency: " + latency[appName]);
    socket.emit("get latency", {
      'latency': latency[appName],
      'jitter': jitter[appName]
    });
  });
});
http.listen(3000, function () {
  console.log("listening on *:3000");
});
