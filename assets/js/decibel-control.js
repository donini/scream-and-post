const meter         = new DecibelMeter('meter');
const levelEl       = $('#meter > span');
const dbGoalEl      = $('#db-goal');
const resultsEl     = $('#results');
const higherDbEl    = $('#higher-db');
const overlay       = $('.overlay');

var startListening = function() {
  var appendDb = '';
  var higherDb = 0;
  connectToSource();
  meter.listen();
  meter.on('sample', (dB, percent, value) => {
    dB = dB + 100; // convert to positive value

    if ( value >= dbGoalEl.val()) {

      if ( dB > higherDb){
        higherDb = dB;
        higherDbEl.css('bottom', higherDb + '%');
        higherDbEl.find('span').text(Math.round(higherDb) + 'dB');
        showExplosion();
        publishPost(higherDb);
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