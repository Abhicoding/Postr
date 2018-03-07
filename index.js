var express = require('express')
var app = express()

var path = require('path')

var randomKey = require('./utilities')

var bodyParser = require('body-parser')

var redis = require('redis')
var client = redis.createClient()

app.use(express.static('resources/static'))
app.use(bodyParser.text())

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/resources/static/index.html'))
})

app.post('/posted', (req, res) => {
  let key = randomKey.keygen()
  client.hmset('posts', key, req.body, redis.print)
  res.send()
})

app.post('/posted', (req, res) => {
  client.hgetall('posts', async function (error, result) {
    if (error) throw error
    let store = await result
    console.log('Got result ->', Object.values(store)/*[x]*/)
  })
  res.send()
})

app.listen(8000, function () {
  console.log('Example app listening on port 8000!')
})

client.on('error', function (err) {
  console.log('Something went wrong ', err)
})





/*
app.get('/getTime', function (req, res) {
  //let time = String(Date.now())
  // console.log(time)
  res.send(time)
  // res.sendFile(path.join(__dirname + '/resources/static/index.html'))
}) */
