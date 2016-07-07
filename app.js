var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var convert = require('convert-seconds');



app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));


var mpd = require('mpd'),
    cmd = mpd.cmd;

var client = mpd.connect({
  port: 6600,
  //host: 'localhost',
  host: '192.168.0.111'
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

function getStatus(){
  client.sendCommand(cmd("status", []), function(err, msg) {
    if (err) throw err;
    var response = mpd.parseKeyValueMessage(msg);
    //var on = response.state == "play";
    //var volume = response.volume;
    //console.log(msg);
    if(response.elapsed > 0){
      var convertedSecs = convert(parseInt(response.elapsed));
      response.elapsedTime = convertedSecs.hours + ':' + ('0' + convertedSecs.minutes).slice(-2) + ':' + ('0' + convertedSecs.seconds).slice(-2);
    }
    io.emit('status', response);
  });
}

client.on('system', function(name) {
  console.log("update", name);
});

client.on('system-player', function() {
    getStatus()
});

client.on('system-database', function() {
    io.emit('database');
});

client.on('system-update', function() {
    io.emit('update');
});

client.on('system-stored_playlist', function() {

});

client.on('system-mixer', function() {
  getStatus();
});

client.on('system-output', function() {

});

client.on('system-options', function() {
  getStatus();
});

client.on('system-sticker', function() {

});

client.on('system-subscription', function() {

});

client.on('system-message', function() {

});


//Controlling playback
app.get('/api/play',function(req, res){
  client.sendCommand(cmd("play", []), function(err, msg) {
    if (err) throw err;
    console.log(msg);
    res.send(msg);
    io.emit('play', msg);
  });
});

app.get('/api/playid/:id',function(req, res){
  client.sendCommand(cmd("play", [req.params.id]), function(err, msg) {
    if (err) throw err;
    console.log(msg);
    res.send(msg);
    io.emit('play', msg);
  });
});

app.get('/api/pause/:onoff',function(req, res){
  client.sendCommand(cmd("pause", [req.params.onoff]), function(err, msg) {
    if (err) throw err;
    console.log(msg);
    res.send(msg);
    io.emit('pause', msg);
  });
});

app.get('/api/stop',function(req, res){
  client.sendCommand(cmd("stop", []), function(err, msg) {
    if (err) throw err;
    console.log(msg);
    var response = mpd.parseKeyValueMessage(msg);
    var on = response.state == "play";
    res.send(on);
    io.emit('stop', msg);
  });
});

app.get('/api/next',function(req, res){
  client.sendCommand(cmd("next", []), function(err, msg) {
    if (err) throw err;
    console.log(msg);
    res.send(msg);
    io.emit('next', msg);
  });
});

app.get('/api/previous',function(req, res){
  client.sendCommand(cmd("previous", []), function(err, msg) {
    if (err) throw err;
    console.log(msg);
    res.send(msg);
    io.emit('previous', msg);
  });
});

app.get('/api/seekid/:id/:time',function(req, res){
  client.sendCommand(cmd("seekid", [req.params.id, req.params.time]), function(err, msg) {
    if (err) throw err;
    console.log(msg);
    res.send(msg);
    io.emit('seekid', msg);
  });
});

app.get('/api/seekcur/:time',function(req, res){
  client.sendCommand(cmd("seekcur", [req.params.time]), function(err, msg) {
    if (err) throw err;
    console.log(msg);
    res.send(msg);
    io.emit('seekcur', msg);
  });
});

//Playback options

app.get('/api/volume/:vol',function(req, res){
  client.sendCommand(cmd("setvol", [req.params.vol]), function(err, msg) {
    if (err) throw err;
    console.log(msg);
    var response = mpd.parseKeyValueMessage(msg);
    var volume = response.volume;
    res.send(volume);
    io.emit('setvol', msg);
  });
});

app.get('/api/repeat/:onoff',function(req, res){
  client.sendCommand(cmd("repeat", [req.params.onoff]), function(err, msg) {
    if (err) throw err;
    console.log(msg);
    res.send(msg);
    io.emit('repeat', msg);
  });
});

app.get('/api/random/:onoff',function(req, res){
  client.sendCommand(cmd("random", [req.params.onoff]), function(err, msg) {
    if (err) throw err;
    console.log(msg);
    res.send(msg);
    io.emit('random', msg);
  });
});
//When single is activated, playback is stopped after current song, or song is repeated if the 'repeat' mode is enabled.
app.get('/api/single/:onoff',function(req, res){
  client.sendCommand(cmd("repeat", [req.params.onoff]), function(err, msg) {
    if (err) throw err;
    console.log(msg);
    res.send(msg);
    io.emit('single', msg);
  });
});
//When consume is activated, each song played is removed from playlist.
app.get('/api/consume/:onoff',function(req, res){
  client.sendCommand(cmd("repeat", [req.params.onoff]), function(err, msg) {
    if (err) throw err;
    console.log(msg);
    res.send(msg);
    io.emit('setvol', msg);
  });
});



//MPD's status
app.get('/api/status',function(req, res){
  client.sendCommand(cmd("status", []), function(err, msg) {
    if (err) throw err;
    var response = mpd.parseKeyValueMessage(msg);
    if(response.elapsed > 0){
      var convertedSecs = convert(parseInt(response.elapsed));
      response.elapsedTime = convertedSecs.hours + ':' + ('0' + convertedSecs.minutes).slice(-2) + ':' + ('0' + convertedSecs.seconds).slice(-2);
    }
    res.send(msg);
    io.emit('status', response);
  });
});

app.get('/api/stats',function(req, res){
  client.sendCommand(cmd("stats", []), function(err, msg) {
    if (err) throw err;
    var response = mpd.parseKeyValueMessage(msg);
    res.send(msg);
    io.emit('stats', response);
  });
});

app.get('/api/currentsong',function(req, res){
  client.sendCommand(cmd("currentsong", []), function(err, msg) {
    if (err) throw err;
    var response = mpd.parseKeyValueMessage(msg);
    res.send(msg);
    var convertedSecs = convert(response.Time);
    response.playtime = convertedSecs.hours + ':' + ('0' + convertedSecs.minutes).slice(-2) + ':' + ('0' + convertedSecs.seconds).slice(-2);
    io.emit('currentsong', response);
  });
});

//The music database
app.get('/api/update',function(req, res){
  client.sendCommand(cmd("update", []), function(err, msg) {
    if (err) throw err;
    console.log(msg);
    res.send(msg);
    io.emit('update', msg);
  });
});












http.listen(3005, function(){
  console.log('listening on *:3005');
});
