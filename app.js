const express = require('express')
const app = express()
const port = 3000
const path = require('path')

var json = require('./config.json');
console.log(json);

app.use('/scripts', express.static(path.join(__dirname, 'node_modules')));
app.use('/scripts', express.static(path.join(__dirname, 'assets')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});


app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})