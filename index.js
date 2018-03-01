var express = require('express')
var path = require('path')
var app = express()
var bodyParser = require('body-parser')

app.use(express.static('resources/static'))
app.use(bodyParser.text())
/*
app.get('/getTime', function (req, res) {
  //let time = String(Date.now())
  // console.log(time)
  res.send(time)
  // res.sendFile(path.join(__dirname + '/resources/static/index.html'))
}) */

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/resources/static/index.html'))
})

app.post('/posted', (req, res) => {
  console.log(req.body)
  	res.send()
})

app.listen(8000, function () {
  console.log('Example app listening on port 8000!')
})
