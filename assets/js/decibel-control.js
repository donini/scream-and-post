const meter         = new DecibelMeter('meter');
const levelEl       = $('#meter > span');
const dbGoalEl      = $('#db-goal');
const resultsEl     = $('#results');
const higherDbEl    = $('#higher-db');
const overlay       = $('.overlay');
const animation     = $('img.photo');



/**
 * CAMERA CONTROL
 */

var takeShot = function( higherDb ) {
  $.getJSON( "../../config", function( data ) {
    var restInfo = data;
    var mediaUrl   = data.mediaUrl;
    var username = data.credentials.username;
    var password = data.credentials.password;

    gifshot.createGIF({
      gifWidth: 640,
      gifHeight: 480,
      interval: 0.1,
      numFrames: 5,
      frameDuration: 1,
      text: 'WordCamp Miami 2018',
      fontWeight: 'normal',
      fontSize: '16px',
      fontFamily: 'sans-serif',
      fontColor: '#ffffff',
      textAlign: 'center',
      textBaseline: 'bottom',
      sampleInterval: 10,
      numWorkers: 2
    }, function (obj) {
        if (!obj.error) {
            var image = obj.image, animatedImage = document.createElement('img');
            animation.attr( 'src', image) ;
            uploadImage( image, mediaUrl, username, password, higherDb );
        }
    });

  });
}

var startListening = function() {
  var appendDb = '';
  var higherDb = 0;
  connectToSource();
  meter.listen();
  meter.on('sample', (dB, percent, value) => {
    dB = dB + 100; 

    if ( dB >= dbGoalEl.val()) {

      if ( dB > higherDb){
        higherDb = dB;
        higherDbEl.css('bottom', higherDb + '%');
        higherDbEl.find('span').text(Math.round(higherDb) + 'dB');
        takeShot( higherDb );
        showExplosion();
        stopListening();
      }

    }

    levelEl.css('height', Math.round(dB) + '%');
    levelEl.text( Math.round(dB) + '%');

    resultsEl.append(Math.round(dB) + 'dB' + '\n');
    resultsEl.scrollTop(resultsEl[0].scrollHeight);

    // console.log(`${dB} dB`);
    // console.log(`${percent} %`);
    // console.log(`${value} val`);
    // console.log('-----------------------');

  });
}

var showExplosion = function() {
  if(overlay.is(':visible'))
    overlay.fadeOut('fast');
  else
    overlay.fadeIn('fast');
}

var clearLiveResults = function() {
  resultsEl.empty();
}

var stopListening = function () {
  if (meter.listening) {
    meter.stopListening();
    diconnectToSource();
    }
}

var connectToSource = function() {
  meter.sources.then(sources => {
      meter.connect(sources[0]);
  });
}

var diconnectToSource = function() {
  if (meter.connected) {
    meter.disconnect();
  }
}

overlay.click(function(e) {
  showExplosion();
});