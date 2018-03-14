const express = require('express')
const app = express()

const path = require('path')
const session = require('express-session')

const randomKey = require('./utilities')

const bodyParser = require('body-parser')

const redis = require('redis')
const client = redis.createClient()

// const session = require('express-session')

app.use(express.static('resources/static'))
app.use(bodyParser.text())
app.use(bodyParser.json())
app.use(session({secret: 'testing'}))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/resources/static/index.html'))
})

app.post('/posted', (req, res) => {
  let key = randomKey.keygen()
  client.hmset('posts', key, req.body, redis.print)
  res.send()
})

app.get('/postdata', (req, res) => {
  client.hgetall('posts', function (error, result) {
    if (error) {
      throw error
    }
    res.send(JSON.stringify(result))
  })
})

app.post('/login', (req, res) => {
  console.log(req.body.username)
  req.session.username = req.body.username
  req.session.password = req.body.password
  res.end('done')
})

app.get('/sign-up', (req, res) => {
  res.sendFile(path.join(__dirname + '/resources/static/sign-up.html'))
})

app.post('/check-email', (req, res) => {
  client.hkeys('users', function (error, result) {
    if (error) {
      throw error
    }
    res.end(result.includes(req.body.email).toString())
  })
})

app.post('/signed-up', (req, res) => {
  console.log(req.body)
  client.hmset('users', req.body.email, req.body.password, redis.print)
  res.redirect('/')
})

app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
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
