const meter         = new DecibelMeter('meter');
const levelEl       = $('#meter > span');
const dbGoalEl      = $('#db-goal');
const resultsEl     = $('#results');
const higherDbEl    = $('#higher-db');

function startListening() {
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
        publishPost();
        stopListening();
      }

      levelEl.css('height', Math.round(dB) + '%');
      levelEl.text( Math.round(dB) + '%');

    }

    resultsEl.append(Math.round(dB) + 'dB' + '\n');
    resultsEl.scrollTop(resultsEl[0].scrollHeight);

    // console.log(`${dB} dB`);
    // console.log(`${percent} %`);
    // console.log(`${value} val`);
    // console.log('-----------------------');

  });
}

function clearLiveResults() {
  resultsEl.empty();
}

function stopListening() {
  if (meter.listening) {
    meter.stopListening();
    diconnectToSource();
    }
}

function connectToSource() {
  meter.sources.then(sources => {
      meter.connect(sources[0]);
  });
}

function diconnectToSource() {
  if (meter.connected) {
    meter.disconnect();
  }
}