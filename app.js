var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var convert = require('convert-seconds');
var player = require('play-sound')(opts = {})

var conected = "";
var port = 6600;
var host = 'localhost';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));


var mpd = require('mpd'),
    cmd = mpd.cmd;

var client  = mpd.connect({
  port: port,
  host: host
});
/*
function connect(){
  if(conected === "end"){
    console.log("dddd");
    delete client;
    client = mpd.connect({
      port: port,
      host: host
    });
  }
}
*/
client.on('ready', function() {
  console.log("ready");
  io.emit('ready');
  player.play('start.mp3', function(err){}) // $ mplayer foo.mp3
});
client.on('end', function() {
  console.log("end");
  io.emit('end');
  conected = "end";
});
client.on('connect', function() {
  console.log("connect");
  io.emit('connect');
  conected = "connect";
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
  console.log("update system: ", name);
});

client.on('system-player', function() {
    getStatus();
    getcurrentsong();
});

client.on('system-database', function() {
    getStats()
    io.emit('database');
});

client.on('system-update', function() {

    io.emit('update');
});

client.on('system-stored_playlist', function() {

});

client.on('system-playlist', function() {
  io.emit('playlist');
});

client.on('system-mixer', function() {
  getStatus();
  getcurrentsong();
});

client.on('system-output', function() {

});

client.on('system-options', function() {
  getStatus();
  getcurrentsong();
});

client.on('system-sticker', function() {

});

client.on('system-subscription', function() {

});

client.on('system-message', function() {

});

client.on('error', function(err) {
    io.emit('error', err);
});


function getStatus(){
  client.sendCommand(cmd("status", []), function(err, msg) {
    if (err) io.emit('error', err);
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

function getStats(){
  client.sendCommand(cmd("stats", []), function(err, msg) {
    if (err) io.emit('error', err);
    var response = mpd.parseKeyValueMessage(msg);
    //res.send(msg);
    io.emit('stats', response);
  });
}

function getcurrentsong(){
  client.sendCommand(cmd("currentsong", []), function(err, msg) {
    if (err) io.emit('error', err);
    var response = mpd.parseKeyValueMessage(msg);

    if(response.elapsed > 0){
      var convertedSecs = convert(response.Time);
      response.playtime = convertedSecs.hours + ':' + ('0' + convertedSecs.minutes).slice(-2) + ':' + ('0' + convertedSecs.seconds).slice(-2);
    }
    io.emit('currentsong', response);
  });
}

//conected
app.get('/api/connect',function(req, res){
  client  = connect();
  res.send("connect");
});

//Controlling playback
app.get('/api/play',function(req, res){
  client.sendCommand(cmd("play", []), function(err, msg) {
    if (err) io.emit('error', err);
    console.log("play: " + msg);
    res.send(msg);
    io.emit('play', msg);
  });
});

app.get('/api/playid/:id',function(req, res){
  client.sendCommand(cmd("play", [req.params.id]), function(err, msg) {
    if (err) io.emit('error', err);
    console.log("playid: " + msg);
    res.send(msg);
    io.emit('play', msg);
  });
});

app.get('/api/playpos/:pos',function(req, res){
  client.sendCommand(cmd("play", [req.params.pos]), function(err, msg) {
    if (err) io.emit('error', err);
    console.log("playpus: " + msg);
    res.send(msg);
    io.emit('play', msg);
  });
});


app.get('/api/pause/:onoff',function(req, res){
  client.sendCommand(cmd("pause", [req.params.onoff]), function(err, msg) {
    if (err) io.emit('error', err);
    console.log("pause" + msg);
    res.send(msg);
    io.emit('pause', msg);
  });
});

app.get('/api/stop',function(req, res){
  client.sendCommand(cmd("stop", []), function(err, msg) {
    if (err) io.emit('error', err);
    console.log("stop" + msg);
    var response = mpd.parseKeyValueMessage(msg);
    var on = response.state == "play";
    res.send(on);
    io.emit('stop', msg);
  });
});

app.get('/api/next',function(req, res){
  client.sendCommand(cmd("next", []), function(err, msg) {
    if (err) io.emit('error', err);
    console.log("next" + msg);
    res.send(msg);
    io.emit('next', msg);
  });
});

app.get('/api/previous',function(req, res){
  client.sendCommand(cmd("previous", []), function(err, msg) {
    if (err) io.emit('error', err);
    console.log( "previous"+ msg);
    res.send(msg);
    io.emit('previous', msg);
  });
});

app.get('/api/seekid/:id/:time',function(req, res){
  client.sendCommand(cmd("seekid", [req.params.id, req.params.time]), function(err, msg) {
    if (err) io.emit('error', err);
    console.log("seekid" + msg);
    res.send(msg);
    io.emit('seekid', msg);
  });
});

app.get('/api/seekcur/:time',function(req, res){
  client.sendCommand(cmd("seekcur", [req.params.time]), function(err, msg) {
    if (err) io.emit('error', err);
    console.log("seekcur" + msg);
    res.send(msg);
    io.emit('seekcur', msg);
  });
});

//Playback options
app.get('/api/volume/:vol',function(req, res){
  client.sendCommand(cmd("setvol", [req.params.vol]), function(err, msg) {
    if (err) io.emit('error', err);
    console.log("setvol" + msg);
    var response = mpd.parseKeyValueMessage(msg);
    var volume = response.volume;
    res.send(volume);
    io.emit('setvol', msg);
  });
});

app.get('/api/repeat/:onoff',function(req, res){
  client.sendCommand(cmd("repeat", [req.params.onoff]), function(err, msg) {
    if (err) io.emit('error', err);
    console.log("repeat" + msg);
    res.send(msg);
    io.emit('repeat', msg);
  });
});

app.get('/api/random/:onoff',function(req, res){
  client.sendCommand(cmd("random", [req.params.onoff]), function(err, msg) {
    if (err) io.emit('error', err);
    console.log("random"+  msg);
    res.send(msg);
    io.emit('random', msg);
  });
});
//When single is activated, playback is stopped after current song, or song is repeated if the 'repeat' mode is enabled.
app.get('/api/single/:onoff',function(req, res){
  client.sendCommand(cmd("single", [req.params.onoff]), function(err, msg) {
    if (err) io.emit('error', err);
    console.log("single"+ msg);
    res.send(msg);
    io.emit('single', msg);
  });
});
//When consume is activated, each song played is removed from playlist.
app.get('/api/consume/:onoff',function(req, res){
  client.sendCommand(cmd("consume", [req.params.onoff]), function(err, msg) {
    if (err) io.emit('error', err);
    console.log("consume" + msg);
    res.send(msg);
    io.emit('consume', msg);
  });
});



//MPD's status
app.get('/api/status',function(req, res){
  client.sendCommand(cmd("status", []), function(err, msg) {
    if (err) io.emit('error', err);
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
    if (err) io.emit('error', err);
    var response = mpd.parseKeyValueMessage(msg);
    res.send(msg);
    io.emit('stats', response);
  });
});

app.get('/api/currentsong',function(req, res){
  client.sendCommand(cmd("currentsong", []), function(err, msg) {
    if (err) io.emit('error', err);
    var response = mpd.parseKeyValueMessage(msg);
    res.send(msg);
    if(response.elapsed > 0){
      var convertedSecs = convert(response.Time);
      response.playtime = convertedSecs.hours + ':' + ('0' + convertedSecs.minutes).slice(-2) + ':' + ('0' + convertedSecs.seconds).slice(-2);
    }
    io.emit('currentsong', response);
  });
});

//The current playlist
app.get('/api/playlistinfo',function(req, res){
  client.sendCommand(cmd("playlistinfo", []), function(err, msg) {
    if (err) io.emit('error', err);
    //var response = mpd.parseArrayMessage(msg);
    var response = mpd.parseListAllInfoResult(msg);

    res.send(msg);
    console.log("playlistinfo" + msg);
    io.emit('playlistinfo', response);
  });
});

app.get('/api/clear',function(req, res){
  client.sendCommand(cmd("clear", []), function(err, msg) {
    if (err) io.emit('error', err);
    //var response = mpd.parseArrayMessage(msg);
    res.send(msg);
    io.emit('clear', msg);
  });
});

app.get('/api/deleteid/:id',function(req, res){
  client.sendCommand(cmd("deleteid", [req.params.id]), function(err, msg) {
    if (err) io.emit('error', err);
    var response = mpd.parseArrayMessage(msg);
    res.send(msg);
    io.emit('deleteid', response);
  });
});

app.get('/api/delete/:pos',function(req, res){
  client.sendCommand(cmd("delete", [req.params.pos]), function(err, msg) {
    if (err) io.emit('error', err);
    if(msg || msg.indexOf('\n')){
      var response = mpd.parseArrayMessage(msg);
      res.send(msg);
      io.emit('delete', response);
    }

  });
});

app.get('/api/add/:uri',function(req, res){
  client.sendCommand(cmd("add", [req.params.uri]), function(err, msg) {
    if (err) io.emit('error', err);
    //var response = mpd.parseArrayMessage(msg);
    res.send(msg);
    io.emit('add', msg);
  });
});

app.get('/api/add_play/:uri/:pus',function(req, res){
  //console.log('add_play');
  client.sendCommands([cmd("add", [req.params.uri]), cmd("play", [req.params.pus])], function(err, msg) {
    if (err) {io.emit('error', err);console.log('error' + err);}
    //var response = mpd.parseArrayMessage(msg);
    res.send(msg);
    io.emit('add paly', msg);
  });
});

app.get('/api/playlistfind/:tag/:needle',function(req, res){
  //console.log('add_play');
  client.sendCommand(cmd("playlistfind", [req.params.tag, req.params.needle]), function(err, msg) {
    if (err) {io.emit('error', err);console.log('error' + err);}
    if(msg ){
      var response = mpd.parseArrayMessage(msg);
      res.send(msg);
      console.log("playlistfind" + msg);
      io.emit('playlistfind', response);
    }

  });
});


//The music database
app.get('/api/update',function(req, res){
  client.sendCommand(cmd("update", []), function(err, msg) {
    if (err) io.emit('error', err);
    console.log("update: " + msg);
    var response = (undefined != msg)? response = mpd.parseKeyValueMessage(msg): "";
    res.send(msg);
    io.emit('update', response);
  });
});

app.get('/api/listfiles/:uri',function(req, res){
  client.sendCommand(cmd("listfiles", [req.params.uri]), function(err, msg) {
    if (err) io.emit('error', err);
    if(msg ){
      var response = mpd.parseArrayMessage(msg);
      res.send(msg);
      io.emit('listfiles', response);
    }

  });
});

app.get('/api/lsinfo/:uri',function(req, res){
  client.sendCommand(cmd("lsinfo", [req.params.uri]), function(err, msg) {
    if (err) io.emit('error', err);
    if(msg){
      var response = mpd.parseArrayMessage(msg);
      res.send(msg);
      io.emit('lsinfo', response);
    }

  });
});

app.get('/api/find/:type/:what',function(req, res){
  client.sendCommand(cmd("find", [req.params.type, req.params.what]), function(err, msg) {
    if (err) io.emit('error', err);
      if(msg){
        var response = mpd.parseArrayMessage(msg);
        res.send(msg);
        io.emit('find', response);
      }

  });
});











http.listen(80, function(){
  console.log('listening on *:80');
});
