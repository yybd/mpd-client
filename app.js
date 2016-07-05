var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');



app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));


var mpd = require('mpd'),
    cmd = mpd.cmd;

var client = mpd.connect({
  port: 6600,
  host: 'localhost',
});

client.on('ready', function() {
  console.log("ready");
});


/*
database - the song database has been modified after update.
update - a database update has started or finished. If the database was modified during the update, the database event is also emitted.
stored_playlist - a stored playlist has been modified, renamed, created or deleted
playlist - the current playlist has been modified
player - the player has been started, stopped or seeked
mixer - the volume has been changed
output - an audio output has been enabled or disabled
options - options like repeat, random, crossfade, replay gain
sticker - the sticker database has been modified.
subscription - a client has subscribed or unsubscribed to a channel
message - a message was received on a channel this client is subscribed to; this event is only emitted when the queue is empty
*/

client.on('system', function(name) {
  console.log("update", name);
});

client.on('system-player', function() {
  client.sendCommand(cmd("status", []), function(err, msg) {
    if (err) throw err;
    console.log(msg);
    io.emit('status', msg);
  });
});

client.on('system-database', function() {

});

client.on('system-update', function() {

});

client.on('system-stored_playlist', function() {

});

client.on('system-mixer', function() {

});

client.on('system-output', function() {

});

client.on('system-options', function() {

});

client.on('system-sticker', function() {

});

client.on('system-subscription', function() {

});

client.on('system-message', function() {

});



app.get('/api/play',function(req, res){
  client.sendCommand(cmd("play", []), function(err, msg) {
    if (err) throw err;
    console.log(msg);
    io.emit('play', msg);
  });
});

app.get('/api/stop',function(req, res){
  client.sendCommand(cmd("stop", []), function(err, msg) {
    if (err) throw err;
    console.log(msg);
    var response = mpd.parseKeyValueMessage(msg);
    var on = response.state == "play";
    io.emit('stop', on);
  });
});

app.get('/api/volume/:vol',function(req, res){
  client.sendCommand(cmd("setvol", [req.params.vol]), function(err, msg) {
    if (err) throw err;
    console.log(msg);
    var response = mpd.parseKeyValueMessage(msg);
    var volume = response.volume;
    io.emit('setvol', volume);
  });
});

app.get('/api/status',function(req, res){
  client.sendCommand(cmd("status", []), function(err, msg) {
    if (err) throw err;
    var response = mpd.parseKeyValueMessage(msg);
    var on = response.state == "play";
    var volume = response.volume;
    //console.log(msg);
    io.emit('status', msg);
  });
});














http.listen(3005, function(){
  console.log('listening on *:3005');
});
