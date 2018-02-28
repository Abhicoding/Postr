var express = require('express')
var path = require('path')
var app = express()

app.use(express.static('resources'))

app.get('/', function (req, res) {
  // console.log(res)
  res.sendFile(path.join(__dirname + '/resources/index.html'))
})

app.listen(8000, function () {
  console.log('Example app listening on port 8000!')
})
