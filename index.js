var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

io.on('connection', function (socket) {
    console.log('socket created');
    let previousId;
    const safeJoin = currentId => {
        socket.leave(previousId);
        socket.join(currentId);
        previousId = currentId;
      };
    socket.on('disconnect', function() {
      console.log('Got disconnect!');
   });
   socket.on('lastKnownLocation', function (data) {
            var location = JSON.stringify(data);
            redisPublisher.publish('locationUpdate', location);
     });
});

var redis = require('redis');
var redisSubscriber = redis.createClient();
var redisPublisher = redis.createClient();redisSubscriber.on('subscribe', function (channel, count) {
        console.log('client subscribed to ' + channel + ', ' + count + ' total subscriptions');
});
redisSubscriber.on('message', function (channel, message) {
    console.log('client channel ' + channel + ': ' + message);
    io.emit('locationUpdate', message);
});

// Start the Server
http.listen(port, function () {
    console.log('Server Started. Listening on *:' + port);
});

// Express Middleware
app.use(express.static('public'));

app.use(bodyParser.urlencoded({
    extended: true
}));
// Render Main HTML file
app.get('/', function (req, res) {
    redisSubscriber.subscribe('locationUpdate');
    res.sendFile('views/index.html', {
        root: __dirname
    });
});

//Serve a Publisher HTML
app.get('/publish', function (req, res) {
    res.sendFile('views/publisher.html', {
        root: __dirname
    });
});