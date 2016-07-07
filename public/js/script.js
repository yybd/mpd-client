var timeSong;


function setStatus(v){
  //$('#messages').append($('<li>').text('Status= ' + JSON.stringify(v)));

  $('#vol').val(v.volume);
  $('#random').html('random ' + v.random);
  $('#repeat').html('repeat ' + v.repeat);
  var t = (v.elapsed)? parseInt(v.elapsed): "";
  $('#elapsedTime').data("time" , t);
  $('#elapsedTime').html(secondstotime($('#elapsedTime').data("time")));

  $('#play').html(v.state);
  console.log(v.state);
}

function setStats(v){
  $('#messages').append($('<li>').text('Stats= ' + JSON.stringify(v)));
}

function setCurrentsong(v){
  //$('#messages').append($('<li>').text('Currentsong= ' + JSON.stringify(v)));

  $('#playtime').html(v.playtime);
  $('#Title').html(v.Title);
  $('#Artist').html(v.Artist);
  $('#Album').html(v.Album);
}

function playState(){
  if(myStatus.state == 'play'){
    pause(1);
    stopTimeSong()
  }
  if(myStatus.state == 'pause' ){
    pause(0);
    startTimeSong()
  }
  if(myStatus.state == 'stop'){
    play();
    startTimeSong()
  }
}

function stopState(){
  stop();
  stopTimeSong()
}

function randomState(){
  if(myStatus.random == 0){
    random(1);
  }
  if(myStatus.random == 1){
    random(0);
  }
}

function repeatState(){
  if(myStatus.repeat == 0){
    repeat(1);
  }
  if(myStatus.repeat == 1){
    repeat(0);
  }
}

function update(){
  $('#messages').append($('<li>').text('update'));
}
function database(){
  $('#messages').append($('<li>').text('database'));
}

function setTimeSong(){
  $('#elapsedTime').data("time", parseInt($('#elapsedTime').data("time")) +1);
  $('#elapsedTime').html(secondstotime($('#elapsedTime').data("time")));
  //console.log($('#elapsedTime').html());
}
function startTimeSong(){
  if (!timeSong) {
    timeSong = setInterval(setTimeSong, 1000);
  }
}
function stopTimeSong(){
  if (timeSong){
    clearInterval(timeSong);
    timeSong = null;
  }
}
function secondstotime(secs)
{
    var t = new Date(1970,0,1);
    t.setSeconds(secs);
    var s = t.toTimeString().substr(3,5);
    if(secs > 86399)
    	s = Math.floor((t - Date.parse("1/1/70")) / 3600000) + s.substr(2);
    return s;
}
