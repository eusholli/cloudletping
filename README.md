# Cloudlet Ping

This application should be deployed to a cloudlet and then the html client can be run to fetch the latency every 1 second.

The client side is a simple prototype to display each result, focus on presentation has not been made

It is important to display the latency for the application of interest and if the display console is connected via a different network then the latency
to show is from the core application so there is a post latancy call and a get latency call.

```
APPNAME = "scoaar";
		latestLatency = 0;
		var socket = io();
		var startTime = 0;
		var initialized = false;

		socket.on("connect", function () {
			if (!initialized) {
				console.log("socket is connected");
				setTimeout(doLatency(), 3000);
				initialized = true;
			}
		});

		socket.on('latencyResp', function () {
			latestLatency = Date.now() - startTime;
			console.log("latestLatency: " + latestLatency);
			$('#messages').append($('<li>').text(latestLatency));
			socket.emit('push latency', APPNAME, latestLatency);
		});

		socket.on('push latency', function (data) {
			console.log("push latency: " + data.latency);
			console.log("push jitter: " + data.jitter);
		});

		socket.on('get latency', function (data) {
			console.log("get latency: " + data.latency);
			console.log("get jitter: " + data.jitter);
			$('#messages').append($('<li>').text(data.latency));
			latestLatency = data.latency;
		});

		function doLatency() {
			startTime = Date.now();
			console.log("startTime: " + startTime);
			socket.emit('latencyTest');
			setTimeout(doLatency, 3000);
		}
```

## To Build the Docker container

```docker build -t eusholli/cloudletping .
docker login docker.mobiledgex.net
docker tag eusholli/cloudletping:latest docker.mobiledgex.net/brexit/images/cloudletping:0.0.1
docker push docker.mobiledgex.net/brexit/images/cloudletping
```
