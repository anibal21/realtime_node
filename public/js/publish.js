var longlats =
[[80.24586,12.98598],
[80.24537,12.98597],
[80.24522,12.98596],
[80.24522,12.98614],
[80.24523,12.98626]];
const socket = io({ transports: ['websocket'] });
var count = 0;
setInterval(function() {
  console.log(count);
  if (count < 5){
    var item = {};
    item.Coordinate = {};
    item.Coordinate.Longitude = longlats[count][0];
    item.Coordinate.Latitude = longlats[count][1];
    count++;
    socket.emit('lastKnownLocation', item);
  }
}, 5000);