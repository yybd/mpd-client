
var wiewplay = {
  "random": "",
  "repeat": "",
  "volume": "",
  "statePlay": "",
  "state": "",
  "time": "100",
  "elapsedTime": "",
  "elapsedTimesec": "",
  "time": "",
  "timesec": "",
  "title": "",
  "artist": "",
  "album": "",
  "pos": "",
  "playlistlength": 0
};

function setStatus(v){
  wiewplay.volume = v.volume;
  var t = (v.elapsed)? parseInt(v.elapsed): "";
  wiewplay.elapsedTime = t;
  wiewplay.elapsedTimesec = secondstotime(t);
  wiewplay.state = v.state;
  if(v.state == 'play'){
    wiewplay.statePlay = "glyphicon-pause";
  }
  if(v.state == 'pause' || v.state == 'stop'){
    wiewplay.statePlay = "glyphicon-play";
  }
  wiewplay.random = (v.random == 1)? "on" : "off";
  wiewplay.repeat = (v.repeat == 1)? "on" : "off";
  wiewplay.playlistlength = v.playlistlength;
  //console.log(wiewplay);


  wiewPlayState(wiewplay);
}

function setCurrentsong(v){
  //$('#messages').append($('<li>').text('Currentsong= ' + JSON.stringify(v)));
  var t = (v.Time)? parseInt(v.Time): "";
  wiewplay.time = t;
  wiewplay.timesec = secondstotime(t);
  wiewplay.title = v.Title;
  wiewplay.artist = v.Artist;
  wiewplay.album = v.Album;
  wiewplay.pos = v.Pos;

  wiewSong(wiewplay)
}

function setPlaylist(v){
  var date = {songs:
    $.map( v , function( value, key ) {
      if(value.Pos) {
        value.Num = parseInt(value.Pos) + 1;

        return value;
      }
    })
  };
  console.log(v);
  console.log(date);
  wiewplaylist(v);
}

function setListfiles(v){
  var list = {'list':{
    files:
    $.map( v , function( value, key ) {
      if(value.file){
        value.fileName = (value.file.lastIndexOf("/")) ? value.file.substring(value.file.lastIndexOf("/") + 1) : value.file;
        return value;
      }
    }),
    dirs:
    $.map( v , function( value, key ) {
    if(value.directory){
        value.dirName = (value.directory.lastIndexOf("/"))? value.directory.substring(value.directory.lastIndexOf("/") + 1) : value.directory;
        return value;
      }
    })
  }};

  wiewFiles(list);
}



////set wiew html
function wiewPlayState(wiewplay){

  $.get('play.html', function(template) {
      var rendered = Mustache.render(template, wiewplay);
      $('#playing').html(rendered);


      $("#play").on("click", function(){
        playState();
      });
      $("#back").on("click", function(){
        previous();
      });
      $("#next").on("click", function(){
        next()
      });
      $("#rangeVol").on("change", function(){
        volume($(this).val())
      });


      if(wiewplay.state == 'play'){
        startTimeSong(wiewTimeSong)
      }
      if(wiewplay.state == 'pause' ){
        stopTimeSong()
      }
      if(wiewplay.state == 'stop'){
        stopTimeSong()
      }
      wiewTimeSong();
    });
}

function wiewSong(wiewplay){
  $.get('song.html', function(template) {
      var rendered = Mustache.render(template, wiewplay);
      $('#contect').html(rendered);

      $("#stop").on("click", function(){
        stopState();
      });
      $("#elapsedTime").on("change", function(){
        seekcur($(this).val())
      });
      $("#random").on("click", function(){
        randomState();
      });
      $("#repeat").on("click", function(){
        repeatState()
      });

    });
}
//var newPos ;
function wiewplaylist(date){
    //if (date.songs[0]){newPos = date.songs[0].Pos;}

    //console.log(newPos);
    $.get('playlist.html', function(template) {
        var rendered = Mustache.render(template, date);
        $('#contect').html(rendered);

        $(".song-playlist").on("click", function(){
          playpos($(this).attr('data-pos'));
        });
        $(".remove-playlist").on("click", function(){
          deleteSongPlaylist($(this).attr('data-pos'));
        });
        $(".remove-allplaylist").on("click", function(){
          clearPlaylist();
        });
        $('#find-playlist').on('keypress', function (event) {
           if(event.which === 13){
              playlistfind($('#sel-type-playlist').val(),$(this).val());
           }
        });

        if(wiewplay.pos){
          $('#'+wiewplay.pos).css("background-color", "#99e6ff");
          var container = $('html,body'),  scrollTo = $('#'+wiewplay.pos);
          container.animate({//scrolls to center
            scrollTop: scrollTo.offset().top  - $('#playing').height() -20
          });
        }
      });

}



function wiewFiles(list){


//console.log(list);
  $.get('files.html', function(template) {
      var rendered = Mustache.render(template, list);
      $('#contect').html(rendered);

      $(".add-dir").on("click", function(){
        addPlaylist($(this).attr('data-dir'));
      });
      $(".add-file").on("click", function(){
        //console.log($(this).attr('data-file'));
        addPlaylist($(this).attr('data-file'));
      });
      $(".add-dir-play").on("click", function(){
        //console.log($(this).attr('data-file'));
        console.log(parseInt(wiewplay.playlistlength) + 1)
        addPlaylistPlay($(this).attr('data-file') ,parseInt(wiewplay.playlistlength) );
      });
      $(".add-file-play").on("click", function(){
        //console.log($(this).attr('data-file'));
        addPlaylistPlay($(this).attr('data-file'), parseInt(wiewplay.playlistlength) );
      });
      $(".file").on("click", function(){
        //addPlaylist($(this).attr('data-dir'));
      });
      $(".dir").on("click", function(){
        lsinfo($(this).attr('data-dir'));
      });
      $(".dir-home").on("click", function(){
        lsinfo('/');
      });
      $(".dir-back").on("click", function(){
        d = isDir.substring(0,isDir.lastIndexOf("/"));
        if(!d){
          d = "/";
        }
        lsinfo(d);
      });
      $(".update").on("click", function(){
        update();
      });
      $('#find-files').on('keypress', function (event) {
         if(event.which === 13){
            find($('#sel-type-files').val(),$(this).val());
         }
      });

  });

}

function wiewTimeSong(){
  $('#elapsedTime').data("time", parseInt($('#elapsedTime').data("time")) + 1);
  $('#elapsedTime').val($('#elapsedTime').data("time"));
  $('#elapsedTimelbl').html(secondstotime($('#elapsedTime').data("time")));
  //console.log($('#elapsedTime').html());
}



///time song
var timeSong;

function startTimeSong(wiewTimeSong){
  if (!timeSong) {
    timeSong = setInterval(wiewTimeSong, 1000);
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
///


var rootDir = "USB/TRANSSCEND_/MUSIC";



$(document).ready(function () {
//get Status & Current song
  //connect();
  getStatus();
  getCurrentsong();
  $("#files").on("click", function(){
    if(!isDir){
      lsinfo(rootDir);
    }
    else {
      lsinfo(isDir);
    }

  });
  $("#music").on("click", function(){
    getCurrentsong();
  });
  $("#playlist").on("click", function(){
    getPlaylist();
  });



});
