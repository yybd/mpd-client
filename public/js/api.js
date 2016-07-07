var myStatus = {};

var socket = io();


//Controlling playback
function play(){
    $.get("/api/play" , function(data, status){});
}

function playid(id){
    $.get("/api/playid/" + id , function(data, status){});
}

function stop(){
  $.get("/api/stop" , function(data, status){});
}

function next(){
  $.get("/api/next" , function(data, status){});

}

function previous(){
  $.get("/api/previous" , function(data, status){});

}
//onoff = 1/0
function pause(onoff){
  $.get("/api/pause/"+ onoff, function(data, status){});

}

function seekid(id, time){
  $.get("/api/seekid/"+ id + "/" + time , function(data, status){});

}

function seekcur(time){
  $.get("/api/seekcur/"+ time , function(data, status){});

}

//Playback options
function volume(vol){
  $.get("/api/volume/"+ vol , function(data, status){});

}

function repeat(onoff){
  $.get("/api/repeat/"+ onoff , function(data, status){});

}

function random(onoff){
  $.get("/api/random/"+ onoff , function(data, status){});

}
//When single is activated, playback is stopped after current song, or song is repeated if the 'repeat' mode is enabled.
function single(onoff){
  $.get("/api/single/"+ onoff , function(data, status){});

}
//When consume is activated, each song played is removed from playlist.
function consume(onoff){
  $.get("/api/consume/"+ onoff , function(data, status){});

}


//MPD's status
function getStatus(){
  $.get("/api/status" , function(data, status){});
}

function getStats(){
  $.get("/api/stats" , function(data, status){});
}

function currentsong(){
  $.get("/api/currentsong" , function(data, status){});
}

//

socket.on('status', function(v){

    $.map(v, function (value, key){
        myStatus[key] = value;
    });
     setStatus(v);
     currentsong();
  });
  socket.on('stats', function(v){
       setStats(v);
    });
    socket.on('currentsong', function(v){
         setCurrentsong(v);
      });
      socket.on('update', function(){
           update();
        });
        socket.on('database', function(){
             database();
          });

socket.on('play', function(v){
    //$('#messages').append($('<li>').text('play= ' + v));
  });
  socket.on('stop', function(v){
      //$('#messages').append($('<li>').text('stop= ' + v));
    });
    socket.on('setvol', function(v){
        //$('#messages').append($('<li>').text('setvol= ' + v));
      });
      socket.on('pause', function(v){
            //$('#messages').append($('<li>').text('stop= ' + v));
          });

getStatus();
