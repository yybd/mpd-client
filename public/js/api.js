var myStatus = {};

var socket = io();

/*
function connect(){
  $.get("/api/connect" , function(data, status){});
}
*/
//Controlling playback
function play(){
    $.get("/api/play" , function(data, status){});
}

function playid(id){
    $.get("/api/playid/" + id , function(data, status){});
}

function playpos(pos){
    $.get("/api/playpos/" + pos , function(data, status){});
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
///Controlling Playback options
function playState(){
  if(myStatus.state == 'play'){
    pause(1);
  }
  if(myStatus.state == 'pause' ){
    pause(0);
  }
  if(myStatus.state == 'stop'){
    play();
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
/////



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

function getCurrentsong(){
  $.get("/api/currentsong" , function(data, status){});
}

//The current playlist
function getPlaylist(){
  $.get("/api/playlistinfo" , function(data, status){});
}

function clearPlaylist(){
  $.get("/api/clear" , function(data, status){});
}

function deleteIdSongPlaylist(id){
  $.get("/api/deleteid/"+ id , function(data, status){});
}

function deleteSongPlaylist(pus){
  $.get("/api/delete/"+ encodeURIComponent(pus) , function(data, status){});
}

function addPlaylist(uri){
  $.get("/api/add/"+ encodeURIComponent(uri) , function(data, status){});
}
function addPlaylistPlay(uri, playPus){
  $.get("/api/add_play/"+ encodeURIComponent(uri) + "/" + encodeURIComponent(playPus) , function(data, status){});
}

function playlistfind(tag, needle){
  $.get("/api/playlistfind/"  + tag + "/" + needle  , function(data, status){});
}


//The music database
function update(){
  $.get("/api/update" , function(data, status){});
}

function listfiles(uri){
  $.get("/api/listfiles/"+ encodeURIComponent(uri) , function(data, status){});
}

var isDir ;
function lsinfo(uri){
  isDir =  uri;
  $.get("/api/lsinfo/"+ encodeURIComponent(uri) , function(data, status){});
}

function find(type, what){
  $.get("/api/find/"+ type + "/" + what , function(data, status){});
}


socket.on('ready', function(v){

  });
  socket.on('connect', function(v){

    });
    socket.on('end', function(v){

      });


socket.on('status', function(v){

    $.map(v, function (value, key){myStatus[key] = value;});
     setStatus(v);

  });
  socket.on('stats', function(v){
       setStats(v);
    });
    socket.on('currentsong', function(v){
         setCurrentsong(v);
      });
      socket.on('update', function(v){
           update(v);
        });
        socket.on('database', function(){
             database();
          });
          socket.on('playlist', function(){
              getStatus();
               getPlaylist();
            });
            socket.on('error', function(v){
              console.log(v);
                $('#messages').append($('<li>').text('error= ' + JSON.stringify(v)));
              });
socket.on('play', function(v){
    //$('#messages').append($('<li>').text('play= ' + v));
  });
  socket.on('stop', function(v){
      //$('#messages').append($('<li>').text('stop= ' + v));
    });
    socket.on('setvol', function(v){
        //$('#messages').append($('<li>').text('setvol= ' + v));
        //console.log('setvol');

      });
      socket.on('pause', function(v){
            //$('#messages').append($('<li>').text('stop= ' + v));
          });

 socket.on('playlistinfo', function(v){
            //  $('#messages').append($('<li>').text('play= ' + JSON.stringify(v)));
             setPlaylist(v);
  });
  socket.on('playlistfind', function(v){
             //  $('#messages').append($('<li>').text('play= ' + JSON.stringify(v)));
              setPlaylist(v);
   });
  socket.on('listfiles', function(v){
               setListfiles(v)

   });
   socket.on('lsinfo', function(v){
      setListfiles(v);
    });
    socket.on('add', function(v){
      console.log('add: ' + v);
       //setListfiles(v);
     });
     socket.on('add paly', function(v){
       console.log('add: ' + v);
        //setListfiles(v);
      });
      socket.on('find', function(v){
        console.log('find: ' + v);
        setListfiles(v);
         //setListfiles(v);
       });
