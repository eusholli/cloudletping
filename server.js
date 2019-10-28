var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var latency = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('push latency', function(appName, latest){
    console.log('latest latency: ' + latest);
		latency[appName] = latest;
    socket.emit('push latency', latency[appName]);
  });
  socket.on('get latency', function(appName){
    console.log('get latency: ' + latency[appName]);
    socket.emit('get latency', latency[appName]);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
